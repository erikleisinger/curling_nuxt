import { defineStore } from "pinia";
import { TABLE_NAMES } from "@/constants/tables";
import { useStorage } from "@vueuse/core";
import { useGameStore } from "@/store/games";
import { newShot } from "@/models/shot";
import type End from "@/types/end";
import type Shot from "@/types/shot";
import type Game from "@/types/game";
import type { GamePlayerJunction } from "@/types/game";
import { CUSTOM_QUERIES } from "@/constants/query";
import { DatabaseError, ErrorName, ValidationError } from "@/types/error";

export const useSessionStore = defineStore("session", {
    state: () => ({
        end: 1,
        ends: useStorage("ends", [] as End[]),
        game: useStorage("game", {} as Game | null),
        gamePlayerPositions: useStorage(
            "gamePlayerPositions",
            {} as GamePlayerJunction
        ),
        loading: false,
        pageLoading: false,
        promptScore: false,
        shot: 1,
        shots: useStorage("shots", [] as Shot[]),
        gameNavHistory: useStorage("gameNavHistory", {}),
    }),
    getters: {
        currentShot(): Shot | null {
            if (!this.game) return null;
            const shot = this.shots.find(
                (s) =>
                    s.shot_no === this.shot && s.end_id === this.currentEnd?.id
            );
            if (shot) return shot;
            return newShot({
                end_id: this.currentEnd?.id,
                shot_no: this.shot,
                player_id: this.getCurrentThrower?.id,
            });
        },
        currentEnd: (state): End | undefined => {
            return state.ends.find(
                ({ end_number }) => end_number === state.end
            );
        },
        getEndByNumber() {
            return (num: number) => {
                return this.ends.find((e) => e.end_number === num);
            };
        },
        getShotByNumberAndEnd() {
            return (shot_no: number, end_id: number) =>
                this.shots.find(
                    (s) => s.shot_no === shot_no && s.end_id === end_id
                );
        },
        getThrowingTeam(): (arg: number) => number | null {
            return (shot_no: number) => {
                if (!this.whoThrowsFirst) return null;
                if (shot_no % 2 === 0) {
                    return this.whoThrowsFirst === "home" ? "away" : "home";
                }
                return this.whoThrowsFirst === "home" ? "home" : "away";
            };
        },
        getCurrentThrower(): { id: number; name: string } {
            const shotNo: number = this.shot;
            const currentTeam = this.getThrowingTeam(shotNo);
            try {
                if (shotNo <= 4) {
                    return this.gamePlayerPositions[`${currentTeam}_lead_id`];
                } else if (shotNo <= 8) {
                    return this.gamePlayerPositions[`${currentTeam}_second_id`];
                } else if (shotNo <= 12) {
                    return this.gamePlayerPositions[`${currentTeam}_third_id`];
                } else if (shotNo <= 16) {
                    return this.gamePlayerPositions[`${currentTeam}_fourth_id`];
                }
            } catch {
                return { id: null, name: null };
            }

            return { id: null, name: null };
        },
        getShotColor() {
            return (shot_no: number) => {
                const whoThrowsFirst = this.whoThrowsFirst;
                if (!whoThrowsFirst) return null;
                if (shot_no % 2 === 0) {
                    return whoThrowsFirst === "home"
                        ? this.game.away_color
                        : this.game.home_color;
                }
                return whoThrowsFirst === "home"
                    ? this.game.home_color
                    : this.game.away_color;
            };
        },
        lastPlayedGame() {
            const gameStore = useGameStore();
            const { games } = gameStore;
            const history = Object.entries(this.gameNavHistory)
                .map(([key, value]) => {
                    return { id: key, ...value };
                })
                .filter(({ id }) => games.some((g) => g.id === Number(id)))
                .sort((a, b) => (b?.lastPlayed || 0) - (a?.lastPlayed || 0));
            return Number(history[0]?.id);
        },
        whoThrowsFirst(): string | null {
            if (!this.game?.id) return null;
            const { hammer_first_end } = this.game || {};
            const { id } = hammer_first_end || {};
            if (this.end === 1)
                return this.game.away.id === id ? "home" : "away";
            const whoScoredLast = [...this.ends]
                .filter((e) => e.end_number < this.end)
                .sort((a, b) => a.end_number - b.end_number)
                .reduce((id: number | null | undefined, current: End) => {
                    if (
                        current?.points_scored === null ||
                        current?.points_scored === undefined
                    )
                        return id;
                    if (current.points_scored > 0)
                        return current.scoring_team_id;
                    return id;
                }, id as number | null | undefined);
            return this.game.away.id === whoScoredLast ? "away" : "home";
        },
    },
    actions: {
        async createEnd(gameId: number, endNo: number) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { data, errors } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.ENDS)
                    .insert({
                        game_id: Number(gameId),
                        end_number: Number(endNo),
                    })
                    .select(CUSTOM_QUERIES.GET_END_WITH_SHOTS)
            );
            if (errors)
                throw new DatabaseError({
                    name: ErrorName.INSERT_ERROR,
                    message: "Error creating end. Database error occured",
                    cause: errors,
                    table: TABLE_NAMES.ENDS,
                    fatal: true,
                });
            const [end] = data;
            return end;
        },
        endSession() {
            if (!this.game?.id) return;
            this.gameNavHistory[this.game.id] = {
                shot: this.shot,
                end: this.end,
                lastPlayed: Math.floor(new Date().getTime() / 1000),
            };
            this.resetSession();
        },
        async getEnd(
            endNo: number,
            gameId: number | undefined,
            force: boolean = false
        ) {
            if (!gameId) {
                throw new ValidationError({
                    name: ErrorName.VALIDATION_FAILED,
                    message: "Could not fetch end: no game id provided.",
                    fatal: true,
                });
            }
            const endInStore = this.ends.find(
                (e) => e.end_number === endNo && e.game_id === gameId
            );
            if (endInStore && !force) return endInStore;
            const { client, fetchHandler } = useSupabaseFetch();
            if (!gameId) return;
            let end;
            const { data, error } = await fetchHandler(
                () =>
                    client
                        .from(TABLE_NAMES.ENDS)
                        .select(CUSTOM_QUERIES.GET_END_WITH_SHOTS)
                        .eq("end_number", endNo)
                        .eq("game_id", gameId),
                { onError: "Error fetching end" }
            );

            if (error)
                throw new DatabaseError({
                    name: ErrorName.SELECT_ERROR,
                    table: TABLE_NAMES.ENDS,
                    message: "Could not fetch end. Database error occured.",
                    fatal: false,
                });

            if (!data?.length) {
                end = await this.createEnd(gameId, endNo);
            } else {
                const [fetchedEnd] = data;
                end = fetchedEnd;
            }
            if (!end?.id) {
                throw new ValidationError({
                    name: ErrorName.VALIDATION_FAILED,
                    message:
                        "Could not fetch end: database returned no results.",
                    fatal: true,
                });
            }
            const index = this.ends.findIndex(
                (g) => g.game_id === gameId && g.end_number === endNo
            );
            const endToInsert = { ...end };
            delete endToInsert.shots;
            if (index === -1) {
                this.ends.push(endToInsert);
            } else {
                this.ends.splice(index, 1, endToInsert);
            }
            return end;
        },
        async initGameJunction(game_id: number) {
            const client = useSupabaseClient();
            const { data, error } = await client
                .from(TABLE_NAMES.PLAYER_GAME_JUNCTION)
                .select(
                    `
            away_lead_id (
                id,
                name
            ),
            away_second_id (
                id,
                name
            ),
            away_third_id (
                id, 
                name
            ),
            away_fourth_id (
                id, 
                name
            ),
            home_lead_id (
                id,
                name
            ),
            home_second_id (
                id,
                name
            ),
            home_third_id (
                id, 
                name
            ),
            home_fourth_id (
                id,
                name
            ),
            game_id
            `
                )
                .eq("game_id", game_id);
            if (error) {
                throw new DatabaseError({
                    name: ErrorName.SELECT_ERROR,
                    message: "Could not initialize game: no game/player info.",
                    table: TABLE_NAMES.PLAYER_GAME_JUNCTION,
                    cause: error,
                    fatal: true,
                });
            } else if (!data || !data?.length) {
                throw new ValidationError({
                    name: ErrorName.VALIDATION_FAILED,
                    message: "Could not initialize game: there are no players!",
                    fatal: true,
                });
            } else {
                const [junction] = data;
                this.gamePlayerPositions = junction;
            }
        },
        async initEnd(end_number: number, gameId: number | undefined) {
            const end = await this.getEnd(end_number, gameId, true);
            if (!end) {
                throw new ValidationError({
                    name: ErrorName.VALIDATION_FAILED,
                    message: "Could not initialize end. No end to initialize!",
                    fatal: true,
                });
            }
            let endShots: Shot[];

            const { shots, id } = end;
            if (!shots.length) {
                const { client, fetchHandler } = useSupabaseFetch();
                const { data, error } = await fetchHandler(() =>
                    client
                        .from(TABLE_NAMES.ENDS)
                        .select(
                            `
                    shots(
                        id,
                        end_id,
                        player_id,
                        shot_no,
                        turn,
                        line,
                        score,
                        type_id,
                        notes,
                        rock_positions
                    )
                    `
                        )
                        .eq("id", id)
                );
                if (error)
                    throw new DatabaseError({
                        name: ErrorName.SELECT_ERROR,
                        message: "Error fetching end: database error occured.",
                        cause: error,
                        fatal: true,
                        table: TABLE_NAMES.ENDS,
                    });
                const [shotsData] = data || [];
                const { shots }: { shots: Shot[] } = shotsData || {};
                endShots = shots;
            } else {
                endShots = shots;
            }
            endShots.forEach((shot) => {
                this.insertShot(shot);
            });
        },
        async initAllEnds(game_id: number) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { data, error } = await fetchHandler(
                () =>
                    client
                        .from(TABLE_NAMES.ENDS)
                        .select(CUSTOM_QUERIES.GET_END_WITH_SHOTS)
                        .eq("game_id", game_id),
                { onError: "Error initializing game: could not init ends" }
            );
            if (!data) {
                throw new ValidationError({
                    name: ErrorName.VALIDATION_FAILED,
                    message:
                        "Could not initialize ends. No ends to initialize!",
                    fatal: true,
                });
            } else if (error) {
                throw new DatabaseError({
                    name: ErrorName.SELECT_ERROR,
                    message:
                        "Could not initialize ends. Database error occured.",
                    cause: error,
                    fatal: true,
                    table: TABLE_NAMES.ENDS,
                });
            }
            const { ends = [], shots = [] } =
                data?.reduce(
                    (all, current: End) => {
                        const { shots: endShots = [], ...rest }: End = current;
                        all.ends.push(rest);
                        all.shots = [...all.shots, ...endShots];
                        return all;
                    },
                    { ends: [], shots: [] } as { ends: End[]; shots: Shot[] }
                ) || {};

            this.ends = ends;
            this.shots = shots;
        },
        async initGame(id: number) {
            const game = await useGameStore().getGame(id);
            if (!game?.id) {
                throw new ValidationError({
                    name: ErrorName.VALIDATION_FAILED,
                    message:
                        "Could not initialized game: no game to initialize!",
                    fatal: true,
                });
            }
            this.setGame(game);
            const { id: game_id } = this.game!;
            if (!game_id) throw new Error("no game id");

            await this.initGameJunction(game_id);

            if (game_id) {
                const previousShotEndPosition = this.gameNavHistory[game_id];
                if (previousShotEndPosition) {
                    this.shot = previousShotEndPosition.shot;
                    this.end = previousShotEndPosition.end;
                }
            }
            await this.initAllEnds(game?.id);
        },
        insertShot(shot: Shot) {
            const index = this.shots.findIndex(
                (s) => s.shot_no === shot.shot_no && s.end_id === shot.end_id
            );
            if (index === -1) {
                this.shots.push(shot);
            } else {
                this.shots.splice(index, 1, shot);
            }
        },
        async prevShot() {
            if (this.shot === 1) {
                await this.goToShot(16, this.end - 1);
            } else {
                await this.goToShot(this.shot - 1, this.end);
            }
        },
        async nextShot() {
            if (this.shot === 16) {
                await this.goToShot(1, this.end + 1);
            } else {
                await this.goToShot(this.shot + 1, this.end);
            }
        },
        async goToShot(shotNo: number, endNo: number) {
            if (shotNo < 1 || shotNo > 16 || endNo < 1) {
                console.error(
                    "CANNOT NAVIGATE TO SHOT: ",
                    shotNo,
                    " END: ",
                    endNo
                );
                return;
            }
            this.setLoading(true);

            if (endNo !== this.end) {
                await this.initEnd(endNo, this.game?.id);
            }
            this.shot = shotNo;
            this.end = endNo;
            this.setLoading(false);
        },

        async saveShot(shot: Shot) {
            const { objTheSame } = useValidation();
            const rockInStore = this.shots.find(
                (s) => s.shot_no === shot.shot_no && s.end_id === shot.end_id
            );
            if (rockInStore && objTheSame(rockInStore, shot)) return;
            if (!shot.id) delete shot.id;
            this.setLoading(true);
            const { client, fetchHandler } = useSupabaseFetch();
            const { getQuery } = useDatabase();
            const { data } = await fetchHandler(
                () =>
                    client
                        .from(TABLE_NAMES.SHOTS)
                        .upsert(
                            {
                                ...shot,
                                end_id: shot.end_id,
                                player_id: shot.player_id,
                            },
                            { onConflict: "end_id, shot_no" }
                        )
                        .select(getQuery(TABLE_NAMES.SHOTS)),
                { onError: "Error saving game" }
            );
            if (!data?.length) return;
            const [savedShot] = data;
            if (!savedShot) return;
            this.insertShot(savedShot);
            this.setLoading(false);
        },
        setGame(game: Game) {
            this.setLoading(true);
            this.game = game;
            this.setLoading(false);
        },
        setLoading(bool: boolean) {
            this.loading = bool;
        },
        setPageLoading(bool: boolean) {
            this.pageLoading = bool;
        },
        async updateScore(
            points_scored: number,
            end_number: number,
            scoring_team_id: number,
            game_id: number
        ) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { data } = await fetchHandler(
                () =>
                    client.from(TABLE_NAMES.ENDS).upsert(
                        {
                            end_number,
                            scoring_team_id,
                            points_scored,
                            game_id,
                        },
                        {
                            ignoreDuplicates: false,
                            onConflict: "game_id, end_number",
                        }
                    ).select(`
        id,
            game_id,
            end_number,
            scoring_team_id,
            points_scored,
            hammer_team_id
            `),
                { onError: "Error updating score" }
            );
            if (!data) return;
            const [end] = data;
            if (!end) return;
            const index = this.ends.findIndex(
                (g) => g.game_id === game_id && g.end_number === end_number
            );
            if (index === -1) {
                this.ends.push(end);
            } else {
                this.ends.splice(index, 1, end);
            }
        },

        resetSession() {
            this.game = null;
            this.shots = [];
            this.shot = 1;
            this.end = 1;
            this.ends = [];
        },
    },
});

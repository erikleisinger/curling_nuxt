import { defineStore } from "pinia";
import { TABLE_NAMES } from "@/constants/tables";
import { useStorage } from "@vueuse/core";
import { useBannerStore } from "@/store/banner";
import { useTeamStore } from "@/store/teams";
import { useGameStore } from "@/store/games";
import { newShot } from "@/models/shot";
import type End from "@/types/end";
import type Shot from "@/types/shot";
import type Game from "@/types/game";
import type { Database } from "@/types/supabase";
import type { SupabaseShotReturn, SupabaseEndReturn } from "types/fetch";
import { BannerColors } from "@/types/color";
import { CUSTOM_QUERIES } from "@/constants/query";

export const useSessionStore = defineStore("session", {
    state: () => ({
        end: 1,
        ends: useStorage("ends", [] as End[]),
        game: useStorage("game", {} as Game | null),
        loading: false,
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
            return newShot({ end_id: this.currentEnd?.id, shot_no: this.shot });
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
        getThrowingTeamId(): (arg: number) => number | null {
            return (shot_no: number) => {
                if (!this.whoThrowsFirst) return null;
                if (shot_no % 2 === 0) {
                    return this.whoThrowsFirst === "home"
                        ? this.game?.away?.id
                        : this.game?.home?.id;
                }
                return this.whoThrowsFirst === "home"
                    ? this.game?.home?.id
                    : this.game?.away?.id;
            };
        },
        getCurrentThrower(): number | null {
            const teamStore = useTeamStore();
            const shotNo: number = this.shot;
            const currentTeam = teamStore.teams.find(
                (t) => t.id === this.getThrowingTeamId(shotNo)
            );
            if (shotNo <= 4) {
                return currentTeam?.lead_player_id?.id ?? null;
            } else if (shotNo <= 8) {
                return currentTeam?.second_player_id?.id ?? null;
            } else if (shotNo <= 12) {
                return currentTeam?.third_player_id?.id ?? null;
            } else if (shotNo <= 16) {
                return currentTeam?.fourth_player_id?.id ?? null;
            }
            return null;
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
            const client = useSupabaseClient<Database>();
            const { data, error } = (await client
                .from(TABLE_NAMES.ENDS)
                .insert({ game_id: Number(gameId), end_number: Number(endNo) })
                .select(
                    CUSTOM_QUERIES.GET_END_WITH_SHOTS
                )) as SupabaseEndReturn;
            if (error) return null;
            const [end] = data;
            return end;
        },
        async getEnd(
            endNo: number,
            gameId: number | undefined,
            force: boolean = false
        ) {
            if (!gameId) {
                const { setBanner } = useBanner();
                setBanner(
                    `Error fetching end: no game id provided.`,
                    BannerColors.Negative
                );
                return;
            }
            const endInStore = this.ends.find(
                (e) => e.end_number === endNo && e.game_id === gameId
            );
            if (endInStore && !force) return endInStore;
            const client = useSupabaseClient<Database>();
            if (!gameId) return;
            let end;
            const { data, error } = await client
                .from(TABLE_NAMES.ENDS)
                .select(CUSTOM_QUERIES.GET_END_WITH_SHOTS)
                .eq("end_number", endNo)
                .eq("game_id", gameId);
            if (!data?.length || error) {
                end = await this.createEnd(gameId, endNo);
            } else {
                const [fetchedEnd] = data;
                end = fetchedEnd;
            }
            if (!end?.id) {
                const { setBanner } = useBanner();
                setBanner(
                    `Error initializing game: could not load game`,
                    BannerColors.Negative
                );
                return;
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
        async initEnd(end_number: number, gameId: number | undefined) {
            const end = await this.getEnd(end_number, gameId, true);
            if (!end) {
                const { setBanner } = useBanner();
                setBanner(
                    `Error initializing end: could not get end`,
                    BannerColors.Negative
                );
                return;
            }
            let endShots: Shot[];

            const { shots, id } = end;
            if (!shots.length) {
                const client = useSupabaseClient();
                const { data, error } = await client
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
                    .eq("id", id);
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
            const client = useSupabaseClient();
            const {data, error} = await client.from(TABLE_NAMES.ENDS).select(CUSTOM_QUERIES.GET_END_WITH_SHOTS).eq('game_id', game_id) as SupabaseEndReturn;
            if (error) {
                const {code} = error;
                const { setBanner } = useBanner();
                setBanner(
                    `Error initializing game: could not init ends (code ${code})`,
                    BannerColors.Negative
                );
                return;
            }
            const {ends = [], shots = []} = data?.reduce((all, current : End) => {
                const {shots: endShots = [], ...rest}: End = current;
                all.ends.push(rest)
                all.shots = [...all.shots, ...endShots]
                return all;
            }, {ends: [], shots: []} as {ends: End[], shots: Shot[]}) || {}
 
            this.ends = ends;
            this.shots = shots;
        },
        async initGame(id: number) {
            this.setLoading(true);

            const game = await useGameStore().getGame(id);
            if (!game?.id) {
                const { setBanner } = useBanner();
                setBanner(
                    `Error initializing game: could not load game`,
                    BannerColors.Negative
                );
                return;
            }
            this.setGame(game);
            const { id: game_id } = this.game!;

            if (game_id) {
                const previousShotEndPosition = this.gameNavHistory[game_id];
                if (previousShotEndPosition) {
                    this.shot = previousShotEndPosition.shot;
                    this.end = previousShotEndPosition.end;
                }
            }
            await this.initAllEnds(game?.id);
            if (!this.ends.find((e) => e.end_number === this.end && e.game_id === game?.id)) {
                await this.initEnd(this.end, game_id);
            }
          
            this.setLoading(false);
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
            const client = useSupabaseClient<Database>();
            const { getQuery } = useDatabase();
            const { data, error } = (await client
                .from(TABLE_NAMES.SHOTS)
                .upsert(
                    {
                        ...shot,
                        end_id: shot.end_id,
                        player_id: shot.player_id,
                    },
                    { onConflict: "end_id, shot_no" }
                )
                .select(getQuery(TABLE_NAMES.SHOTS))) as SupabaseShotReturn;
            if (!data?.length || error) {
                const { code } = error || {};
                const { setBanner } = useBanner();
                setBanner(
                    `Error saving game (code ${code})`,
                    BannerColors.Negative
                );

                return;
            }
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
        async updateScore(
            points_scored: number,
            end_number: number,
            scoring_team_id: number,
            game_id: number
        ) {
            const client = useSupabaseClient<Database>();
            const { data, error } = await client.from(TABLE_NAMES.ENDS).upsert(
                {
                    end_number,
                    scoring_team_id,
                    points_scored,
                    game_id,
                },
                { ignoreDuplicates: false, onConflict: "game_id, end_number" }
            ).select(`
        id,
            game_id,
            end_number,
            scoring_team_id,
            points_scored,
            hammer_team_id
            `);
            if (error) {
                const { code } = error || {};
                const bannerStore = useBannerStore();
                bannerStore.setText(
                    `Error updating score (code ${code})`,
                    BannerColors.Negative
                );
                return;
            }
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
        endSession() {
            if (!this.game?.id) return;
            this.gameNavHistory[this.game.id] = {
                shot: this.shot,
                end: this.end,
            };
            this.resetSession();
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

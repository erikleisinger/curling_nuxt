import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import type Game from "@/types/game";
import type End from "@/types/end";
import type { SupabaseGameReturn } from "types/fetch";
import type { Database } from "@/types/supabase";
import { useNotificationStore } from "@/store/notification";
import { useSessionStore } from "@/store/session";

export const useGameStore = defineStore("games", {
    state: () => {
        return {
            games: useStorage("games", [] as Game[]),
        };
    },
    actions: {
        async createGameEnds(ends: Partial<End>[]) {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: "pending",
                text: `Saving ends...`,
                timeout: 10000,
            });

            const { client, fetchHandler } = useSupabaseFetch();
            const { error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.ENDS)
                    .upsert(ends, {
                        onConflict: "game_id, end_number",
                        ignoreDuplicates: false,
                    })
            );

            if (error) {
                // const duplicate = new RegExp("unique_team_request");

                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `Error saving ends: ${error.message} (code ${
                        error?.code ?? "X"
                    })`,
                    timeout: 10000,
                });
            } else {
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: "Ends saved!",
                    timeout: 3000,
                });
            }
        },

        async deleteGame(id: number | null) {
            const { client, fetchHandler } = useSupabaseFetch();
            const { data } = await fetchHandler(
                () => client.from(TABLE_NAMES.GAMES).delete().eq("id", id),
                { onError: "Error deleting game" }
            );
            if (data) {
                const index = this.games.findIndex((g) => g.id === id);
                if (index === -1) return;
                this.games.splice(index, 1);
            }
        },
        async fetchGames(force: boolean) {
            if (this.games?.length && !force) return;

            const { client, fetchHandler } = useSupabaseFetch();
            const { data } = (await fetchHandler(
                () => client.rpc("get_games"),
                { onError: "Error getting games." }
            )) as SupabaseGameReturn;
            if (data) {
                this.games = data ?? [];
            }
        },
        /**
         *
         * @param id - id of a game to fetch
         * @param noCache - if `false` (by default), will check local cache first and only query if the game is not found. `true` means we fetch a fresh game from the database.
         *
         * @returns {Game | null}
         */
        async getGame(id: number | null, noCache: boolean = false) {
            if (!noCache) {
                const game = this.games.find((g) => g.id === id);
                if (game) return game;
            }
            const { client, fetchHandler } = useSupabaseFetch();
            const { getQuery } = useDatabase();
            const { data } = await fetchHandler(
                () =>
                    client
                        .from(TABLE_NAMES.GAMES)
                        .select(getQuery(TABLE_NAMES.GAMES))
                        .eq("id", id),
                { onError: "Error retrieving game." }
            );
            if (data) {
                const [game] = data || [];
                return game;
            }
            return null;
        },
        async insertGame(game: Partial<Game>) {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: "pending",
                text: `Saving game...`,
                timeout: 10000,
            });
            const { client, fetchHandler } = useSupabaseFetch();
            const { getQuery } = useDatabase();
            const { data, error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.GAMES)
                    .upsert(game)
                    .select(getQuery(TABLE_NAMES.GAMES))
            );

            if (error) {
                // const duplicate = new RegExp("unique_team_request");

                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `Error creating game: ${error.message} (code ${
                        error?.code ?? "X"
                    })`,
                    timeout: 10000,
                });
            } else {
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: "Game saved!",
                    timeout: 3000,
                });
            }

            if (data) {
                const [game] = data;
                const index = this.games.findIndex((g) => g.id === game.id);
                if (index === -1) {
                    this.games.push(game);
                } else {
                    this.games.splice(index, 1, game);
                }
                const sessionStore = useSessionStore();
                if (game?.id === sessionStore?.game?.id) {
                    sessionStore.setGame(game);
                }
                return game?.id;
            }
            return null;
        },
        resetGames() {
            this.games = [];
        },
        async bulkUpdateGameEnds(ends: End[]) {
            let error;
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: "pending",
                text: `Updating ends...`,
                timeout: 10000,
            });
         
            await Promise.all(ends.map((end) => {
                return new Promise<void>(async (resolve) => {
                    const err = await this.updateGameEnd(end, false);
                    if (err) error = err;
                    resolve();
                });
            }));

            if (error) {
                // const duplicate = new RegExp("unique_team_request");

                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `Error updating end: ${error.message} (code ${
                        error?.code ?? "X"
                    })`,
                    timeout: 10000,
                });
                return true;
            } else {
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: "Ends updated!",
                    timeout: 3000,
                });
                return false;
            }
        },
        async updateGameEnd(end: End, notify: boolean = true) {
            const notStore = useNotificationStore();
            let notId;
            if (notify) {
                notId = notStore.addNotification({
                    state: "pending",
                    text: `Updating end...`,
                    timeout: 10000,
                });
            }

            const { client, fetchHandler } = useSupabaseFetch();
            const { data, error } = await fetchHandler(() =>
                client
                    .from(TABLE_NAMES.ENDS)
                    .update(end)
                    .eq("end_number", end.end_number)
                    .eq("game_id", end.game_id)
            );

            if (!notify) error;
            if (error) {
                // const duplicate = new RegExp("unique_team_request");

                notStore.updateNotification(notId, {
                    state: "failed",
                    text: `Error updating end: ${error.message} (code ${
                        error?.code ?? "X"
                    })`,
                    timeout: 10000,
                });
                return true;
            } else {
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: "End updated!",
                    timeout: 3000,
                });
                return false;
            }
        },
    },
});

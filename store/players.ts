import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Player from "@/types/player";

export const usePlayerStore = defineStore("players", {
  state: () => {
    return {
      players: useStorage("players", [] as Player[]),
    };
  },
  getters: {
    getPlayer() {
        return (playerId: number) => {
            return this.players.find(({id}) => playerId === id)
        }
    },
    getPlayerName() {
        return (playerId: number) => {
            return this.players.find(({id}) => playerId === id)?.name || 'Unnamed player'
        }
    },
  },
  actions: {
    async deletePlayer(id: number | null) {
      const {client, fetchHandler} = useSupabaseFetch();
      const {data} = await fetchHandler(() => client
        .from(TABLE_NAMES.PLAYERS)
        .delete()
        .eq("id", id)
        .select(), {onError: 'Error deleting player.'});
      if (data) {
        const index = this.players.findIndex((g) => g.id === id);
        if (index === -1) return;
        this.players.splice(index, 1);
      }
    },
    async fetchPlayers(force = false) {
      if (this.players.length && !force) return;
      const {client, fetchHandler} = useSupabaseFetch();
      const {data} = await fetchHandler(()=> client
        .from(TABLE_NAMES.PLAYERS)
        .select("*"), {onError: 'Error getting players'})
     if (data) {
        this.players = data;
        this.sortPlayers();
      }
    },

    async insertPlayer(player: any) {
      const {getUser} = useDatabase();
      // TODO: Do I need the profile_id here? 
      const {id} = getUser() ?? {};
      const {client, fetchHandler} = useSupabaseFetch();
      const {data} = await fetchHandler(() => client
        .from(TABLE_NAMES.PLAYERS)
        .upsert({
          ...player,
          profile_id: id,
        })
        .select(), {onError: 'Error creating player.'});
      const [newPlayer] = data || [];
      if (newPlayer) {
        const index = this.players.findIndex((g) => g.id === newPlayer.id);
        if (index === -1) {
          this.players.push(newPlayer);
        } else {
          this.players.splice(index, 1, newPlayer);
        }
        this.sortPlayers();
        return newPlayer
      } 
      return null;
    },
    async refreshPlayer(playerId: number, shouldSort = false) {
        const { client, fetchHandler } = useSupabaseFetch();
        //   const {data} = await fetchHandler(() => client
        //     .rpc('get_team_detailed', {team_id_param: teamId}), {onError: 'Error refreshing team'})
        const { getQuery } = useDatabase();
        const { data } = await fetchHandler(
            () =>
                client
                    .from(TABLE_NAMES.PLAYERS)
                    .select('*')
                    .eq('id', playerId),

            { onError: "Error fetching teams" }
        );
        const [refreshedPlayer] = data || [];

        if (refreshedPlayer) {
            const index = this.players.findIndex(
                (g) => g.id === refreshedPlayer.id
            );
            if (index === -1) {
                this.players.push(refreshedPlayer);
            } else {
                this.players.splice(index, 1, refreshedPlayer);
            }
            if (shouldSort) this.sortPlayers();
        }
    },
    resetPlayers() {
        this.players = []
      },
    sortPlayers() {
      const {sortNameAlphabetically} = useSort();
      this.players.sort(sortNameAlphabetically);
    },
    async updatePlayerLink({playerId, profileId} : {playerId: number, profileId: string}) {
        const { client, fetchHandler } = useSupabaseFetch();
        const { error } = await fetchHandler(() =>
            client
                .from(TABLE_NAMES.PLAYERS)
                .update({profile_id_for_player: profileId})
                .eq("id", playerId)
        );

        if (error) {
            throw new Error(error)
        }
        this.refreshPlayer(playerId);
    },

  },
});

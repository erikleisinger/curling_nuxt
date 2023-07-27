import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Player from "@/types/player";
import type {SupabasePlayerReturn} from "types/fetch";
import { BannerColors } from "@/types/color";

export const usePlayerStore = defineStore("players", {
  state: () => {
    return {
      players: useStorage("players", [] as Player[]),
    };
  },
  getters: {
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
    resetPlayers() {
        this.players = []
      },
    sortPlayers() {
      const {sortNameAlphabetically} = useSort();
      this.players.sort(sortNameAlphabetically);
    },

  },
});

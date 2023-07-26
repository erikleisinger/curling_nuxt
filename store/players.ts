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
      const client = useSupabaseClient();
      const {data, error} = await client
        .from(TABLE_NAMES.PLAYERS)
        .delete()
        .eq("id", id);
      if (error) {
        const {code} = error || {};
        const {setBanner} = useBanner();
        setBanner(`Error deleting player (code ${code})`, BannerColors.Negative);
      } else {
        const index = this.players.findIndex((g) => g.id === id);
        if (index === -1) return;
        this.players.splice(index, 1);
      }
    },
    async fetchPlayers(force = false) {
      if (this.players.length && !force) return;
      const client = useSupabaseClient();
      const {error, data}: SupabasePlayerReturn = await client
        .from(TABLE_NAMES.PLAYERS)
        .select("*")
      if (error) {
        const {setBanner} = useBanner();
        setBanner("Error getting players.", BannerColors.Negative);
      } else if (data) {
        this.players = data;
        this.sortPlayers();
      }
    },

    async insertPlayer(player: any) {
      const client = useSupabaseClient();
      const {getUser} = useDatabase();
      const {id} = getUser() ?? {};
      const {data, error}: SupabasePlayerReturn = await client
        .from(TABLE_NAMES.PLAYERS)
        .upsert({
          ...player,
          profile_id: id,
        })
        .select();
      const [newPlayer] = data || [];
      if (error || !newPlayer) {
        const {code} = error || {};
        const {setBanner} = useBanner();
        setBanner(`Error creating player (code ${code})`, BannerColors.Negative);
        return null;
      } else {
        const index = this.players.findIndex((g) => g.id === newPlayer.id);
        if (index === -1) {
          this.players.push(newPlayer);
        } else {
          this.players.splice(index, 1, newPlayer);
        }
        this.sortPlayers();
        return newPlayer
      }
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

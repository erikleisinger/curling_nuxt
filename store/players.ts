import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Player from "@/types/player";
import type {SupabasePlayerReturn} from "types/fetch";

export const usePlayerStore = defineStore("players", {
  state: () => {
    return {
      players: useStorage("players", [] as Player[]),
    };
  },
  actions: {
    async deletePlayer(id: number | null) {
      const client = useSupabaseAuthClient();
      const {data, error} = await client
        .from(TABLE_NAMES.PLAYERS)
        .delete()
        .eq("id", id);
      if (error) {
        const {code} = error || {};
        const {setBanner} = useBanner();
        setBanner(`Error deleting player (code ${code})`, "negative");
      } else {
        const index = this.players.findIndex((g) => g.id === id);
        if (index === -1) return;
        this.players.splice(index, 1);
      }
    },
    async fetchPlayers(force = false) {
      if (this.players.length && !force) return;
      const client = useSupabaseAuthClient();
      const {getUserId} = useDatabase();
      const {error, data}: SupabasePlayerReturn = await client
        .from(TABLE_NAMES.PLAYERS)
        .select("*")
        .eq("profile_id", getUserId());
      if (error) {
        const {setBanner} = useBanner();
        setBanner("Error getting players.");
      } else if (data) {
        this.players = data;
        this.sortPlayers();
      }
    },

    async insertPlayer(player: any) {
      const client = useSupabaseAuthClient();
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
        setBanner(`Error creating player (code ${code})`, "negative");
      } else {
        const index = this.players.findIndex((g) => g.id === newPlayer.id);
        if (index === -1) {
          this.players.push(newPlayer);
        } else {
          this.players.splice(index, 1, newPlayer);
        }
        this.sortPlayers();
      }
    },
    sortPlayers() {
      const {sortNameAlphabetically} = useSort();
      this.players.sort(sortNameAlphabetically);
    },
  },
});

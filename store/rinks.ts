import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Rink from "@/types/rink";
import type {SupabaseRinkReturn} from "types/fetch";
import { BannerColors } from "@/types/color";

export const useRinkStore = defineStore("rink", {
  state: () => {
    return {
      rinks: useStorage("rinks", [] as Rink[]),
    };
  },
  actions: {
    async deleteRink(id: number | null) {
      const client = useSupabaseAuthClient();
      const {data, error} = await client
        .from(TABLE_NAMES.RINKS)
        .delete()
        .eq("id", id);
      if (error) {
        const {code} = error || {};
        const {setBanner} = useBanner();
        setBanner(`Error deleting rink (code ${code})`, BannerColors.Negative);
      } else {
        const index = this.rinks.findIndex((g) => g.id === id);
        if (index === -1) return;
        this.rinks.splice(index, 1);
      }
    },
    async fetchRinks(force = false) {
      if (this.rinks.length && !force) return;
      const client = useSupabaseAuthClient();
      const {error, data}: SupabaseRinkReturn = await client
        .from(TABLE_NAMES.RINKS)
        .select("*")
      if (error) {
        const {setBanner} = useBanner();
        setBanner("Error getting rink.", BannerColors.Negative);
      } else if (data) {
        this.rinks = data;
        this.sortRinks();
      }
    },

    async insertRink(rink: any) {
      const client = useSupabaseAuthClient();
      const {getUser} = useDatabase();
      const {id} = getUser() ?? {};
      const {data, error}: SupabaseRinkReturn = await client
        .from(TABLE_NAMES.RINKS)
        .upsert(rink)
        .select();
      const [newRink] = data || [];
      if (error || !newRink) {
        const {code} = error || {};
        const {setBanner} = useBanner();
        setBanner(`Error creating rink (code ${code})`, BannerColors.Negative);
        return null;
      } else {
        const index = this.rinks.findIndex((g) => g.id === newRink.id);
        if (index === -1) {
          this.rinks.push(newRink);
        } else {
          this.rinks.splice(index, 1, newRink);
        }
        this.sortRinks();
        return newRink
      }
    },
    sortRinks() {
      const {sortNameAlphabetically} = useSort();
      this.rinks.sort(sortNameAlphabetically);
    },
    resetRinks() {
      this.rinks = []
    }
  },
});

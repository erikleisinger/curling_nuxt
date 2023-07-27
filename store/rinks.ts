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
        const {client, fetchHandler} = useSupabaseFetch();;
      const {data} = await fetchHandler(() => client
        .from(TABLE_NAMES.RINKS)
        .delete()
        .eq("id", id), {onError: 'Error deleting rink'})
      if (data) {
        const index = this.rinks.findIndex((g) => g.id === id);
        if (index === -1) return;
        this.rinks.splice(index, 1);
      }
    },
    async fetchRinks(force = false) {
      if (this.rinks.length && !force) return;
      const {client, fetchHandler} = useSupabaseFetch();;
      const {data} = await fetchHandler(() => client
        .from(TABLE_NAMES.RINKS)
        .select("*"), {onError: 'Error getting rink'})
     if (data) {
        this.rinks = data;
        this.sortRinks();
      }
    },

    async insertRink(rink: any) {
        const {client, fetchHandler} = useSupabaseFetch();;
      const {data} = await fetchHandler(() => client
        .from(TABLE_NAMES.RINKS)
        .upsert(rink)
        .select(), {onError: 'Error creating rink'})
      const [newRink] = data || [];
      if (data) {
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

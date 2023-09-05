import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Rock from "@/types/rock";
import type {SupabaseRockReturn} from "types/fetch";

export const useRockStore = defineStore("rockss", {
  state: () => {
    return {
      rocks: useStorage("rocks", [] as Rock[]),
    };
  },
  actions: {
    async deleteRock(id: number | null) {
      const client = useSupabaseClient();
      const {data, error} = await client
        .from(TABLE_NAMES.ROCKS)
        .delete()
        .eq("id", id);
      if (error) return;
     
        const index = this.rocks.findIndex((g) => g.id === id);
        if (index === -1) return;
        this.rocks.splice(index, 1);
      
    },
    async insertRocks(force = false) {
      if (this.rocks.length && !force) return;
      const client = useSupabaseClient();
      const {error, data}: SupabaseRockReturn = await client
        .from(TABLE_NAMES.ROCKS)
        .select("*")
      if (error || !data) return;
        this.rocks = data;
        this.sortRocks();
      
    },

    async insertRock(rock: any) {
      const client = useSupabaseClient();
      const {data, error}: SupabaseRockReturn = await client
        .from(TABLE_NAMES.ROCKS)
        .upsert(rock)
        .select();
      const [newRock] = data || [];
      if (error || !newRock) return;
        const index = this.rocks.findIndex((g) => g.id === newRock.id);
        if (index === -1) {
          this.rocks.push(newRock);
        } else {
          this.rocks.splice(index, 1, newRock);
        }
        this.sortRocks();
        return newRock
      
    },
    sortRocks() {
      const {sortNameAlphabetically} = useSort();
      this.rocks.sort(sortNameAlphabetically);
    },
    resetRocks() {
      this.rocks = []
    }
  },
});

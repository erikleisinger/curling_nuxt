import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Sheet from "@/types/sheet";
import type {SupabaseSheetReturn} from "types/fetch";

export const useSheetStore = defineStore("sheets", {
  state: () => {
    return {
      sheets: useStorage("sheets", [] as Sheet[]),
    };
  },
  actions: {
    async deleteSheet(id: number | null) {
        const {client, fetchHandler} = useSupabaseFetch();
      const {data} = await fetchHandler(() => client
        .from(TABLE_NAMES.SHEETS)
        .delete()
        .eq("id", id), {onError: 'Error deleting sheet'})
      if (data)  {
        const index = this.sheets.findIndex((g) => g.id === id);
        if (index === -1) return;
        this.sheets.splice(index, 1);
      }
    },
    async fetchSheets(force = false) {
      if (this.sheets.length && !force) return;
      const {client, fetchHandler} = useSupabaseFetch();
      const { data} = await fetchHandler(() => client
        .from(TABLE_NAMES.SHEETS)
        .select("*"), {onError: 'Error getting sheets'})
     if (data) {
        this.sheets = data;
        this.sortSheets();
      }
    },

    async insertSheet(sheet: any) {
        const {client, fetchHandler} = useSupabaseFetch();
      const {data} = await fetchHandler(() => client
        .from(TABLE_NAMES.SHEETS)
        .upsert(sheet)
        .select(), {onError: 'Error creating sheet'})
      const [newSheet] = data || [];
      if (newSheet) {
        const index = this.sheets.findIndex((g) => g.id === newSheet.id);
        if (index === -1) {
          this.sheets.push(newSheet);
        } else {
          this.sheets.splice(index, 1, newSheet);
        }
        this.sortSheets();
        return newSheet
      }
    },
    sortSheets() {
      const {sortNameAlphabetically} = useSort();
      this.sheets.sort(sortNameAlphabetically);
    },
    resetSheets() {
      this.sheets = []
    }
  },
});

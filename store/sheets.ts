import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Sheet from "@/types/sheet";
import type {SupabaseSheetReturn} from "types/fetch";
import { BannerColors } from "@/types/color";

export const useSheetStore = defineStore("sheets", {
  state: () => {
    return {
      sheets: useStorage("sheets", [] as Sheet[]),
    };
  },
  actions: {
    async deleteSheet(id: number | null) {
      const client = useSupabaseAuthClient();
      const {data, error} = await client
        .from(TABLE_NAMES.SHEETS)
        .delete()
        .eq("id", id);
      if (error) {
        const {code} = error || {};
        const {setBanner} = useBanner();
        setBanner(`Error deleting sheet (code ${code})`, BannerColors.Negative);
      } else {
        const index = this.sheets.findIndex((g) => g.id === id);
        if (index === -1) return;
        this.sheets.splice(index, 1);
      }
    },
    async fetchSheets(force = false) {
      if (this.sheets.length && !force) return;
      const client = useSupabaseAuthClient();
      const {error, data}: SupabaseSheetReturn = await client
        .from(TABLE_NAMES.SHEETS)
        .select("*")
      if (error) {
        const {setBanner} = useBanner();
        setBanner("Error getting sheet.", BannerColors.Negative);
      } else if (data) {
        this.sheets = data;
        this.sortSheets();
      }
    },

    async insertSheet(sheet: any) {
      const client = useSupabaseAuthClient();
      const {data, error}: SupabaseSheetReturn = await client
        .from(TABLE_NAMES.SHEETS)
        .upsert(sheet)
        .select();
      const [newSheet] = data || [];
      if (error || !newSheet) {
        const {code} = error || {};
        const {setBanner} = useBanner();
        setBanner(`Error creating sheet (code ${code})`, BannerColors.Negative);
        return null;
      } else {
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

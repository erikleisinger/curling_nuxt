import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type ShotType from "@/types/shottype";
import type {SupabaseShotTypeReturn} from "types/fetch";
import type {Database} from '@/types/supabase'
import { BannerColors } from "@/types/color";

export const useShotTypeStore = defineStore("shotTypes", {
  state: () => {
    return {
      shotTypes: useStorage("shotTypes", [] as ShotType[]),
    };
  },
  actions: {
    async deleteShotType(id: number | null) {
      const client = useSupabaseAuthClient();
      const {error} = await client
        .from(TABLE_NAMES.SHOT_TYPES)
        .delete()
        .eq("id", id);
      if (error) {
        const {code} = error || {};
        const {setBanner} = useBanner();
        setBanner(`Error deleting shot type (code ${code})`, BannerColors.Negative);
      } else {
        const index = this.shotTypes.findIndex((st) => st.id === id);
        if (index === -1) return;
        this.shotTypes.splice(index, 1);
      }
    },
    async fetchShotTypes(force: boolean) {
        if (this.shotTypes.length && !force) return;
        const client = useSupabaseAuthClient<Database>();
        const {getUser} = useDatabase()
        const {id} = getUser() || {};
        const {data, error} = await client.from(TABLE_NAMES.SHOT_TYPES).select(`
        id,
        name,
        shot_type
        `).or(`profile_id.eq.${id},is_global.eq.true`)
  
        if (error || !data?.length) {
          const {code} = error || {};
          const {setBanner} = useBanner();
          setBanner("Error getting shot types.", BannerColors.Negative);
        } else if (data) {
          this.shotTypes = data
        }
        this.sortShotTypes();
      },
      async insertShotType(shotType: ShotType) {
        const client = useSupabaseAuthClient<Database>();
        const {getUser, getQuery} = useDatabase();
        const {id} = getUser() ?? {};
        const {data, error} = await client
          .from(TABLE_NAMES.SHOT_TYPES)
          .upsert({
            ...shotType,
            profile_id: id,
          })
          .select(getQuery(TABLE_NAMES.SHOT_TYPES)) as SupabaseShotTypeReturn
          if (error || !data?.length) {
            const {code} = error || {};
            const {setBanner} = useBanner();
          setBanner(`Error creating shot type (code ${code})`, BannerColors.Negative);
          } else {
            const [st] = data;
            const index = this.shotTypes.findIndex((s) => s.id === st.id);
            if (index === -1) {
              this.shotTypes.push(st);
            } else {
              this.shotTypes.splice(index, 1, st);
            }
          }
          this.sortShotTypes();
      },
      sortShotTypes() {
        const {sortNameAlphabetically} = useSort();
        this.shotTypes.sort(sortNameAlphabetically);
      },
      resetShotTypes() {
        this.shotTypes = []
      }


  },
});
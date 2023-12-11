import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import Rink from '@/store/models/rink'

export const useRinkStore = defineStore("rink", {

  actions: {
    
    async fetchRinks() {
      const {client, fetchHandler} = useSupabaseFetch();;
      const {data} = await fetchHandler(() => client
        .from(TABLE_NAMES.RINKS)
        .select("*"), {onError: 'Error getting rink'})
     if (data)  useRepo(Rink).save(data)
    },


  },
});

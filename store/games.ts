import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Game from "@/types/game";
import type {SupabaseGameReturn} from "types/fetch";
import type {Database} from '@/types/supabase'
import { BannerColors } from "@/types/color";
import {useSessionStore} from '@/store/session'

export const useGameStore = defineStore("games", {
  state: () => {
    return {
      games: useStorage("games", [] as Game[]),
    };
  },
  actions: {
    async deleteGame(id: number | null) {
      const client = useSupabaseAuthClient();
      const {data, error} = await client
        .from(TABLE_NAMES.GAMES)
        .delete()
        .eq("id", id);
      if (error) {
        const {code} = error || {};
        const {setBanner} = useBanner();
        setBanner(`Error deleting game (code ${code})`, BannerColors.Negative);
      } else {
        const index = this.games.findIndex((g) => g.id === id);
        if (index === -1) return;
        this.games.splice(index, 1);
      }
    },
    async fetchGames(force:boolean) {
        if (this.games?.length && !force) return;
        const {getUser, getQuery} = useDatabase();
        const {id} = getUser() ?? {};
        const client = useSupabaseAuthClient<Database>();
        const {data, error} = await client
          .from(TABLE_NAMES.GAMES)
          .select(getQuery(TABLE_NAMES.GAMES))
          .eq("profile_id", id) as SupabaseGameReturn
          if (error) {
            const {setBanner} = useBanner();
            setBanner("Error getting games.", BannerColors.Negative);
          } else if (data) {
            this.games =  data ?? [];
          }

  
      },

      async insertGame(game: Game) {
        const client = useSupabaseAuthClient<Database>();
        const {getUser, getQuery} = useDatabase();
        const {id} = getUser() ?? {};
        const {data, error} = await client
          .from(TABLE_NAMES.GAMES)
          .upsert({
            ...game,
            profile_id: id,
          })
          .select(getQuery(TABLE_NAMES.GAMES)) as SupabaseGameReturn
        if (error || !data?.length) {
          const {code} = error || {};
          const {setBanner} = useBanner();
          setBanner(`Error creating game (code ${code})`, BannerColors.Negative);
        } else {
          const [game] = data;
          const index = this.games.findIndex((g) => g.id === game.id);
          if (index === -1) {
            this.games.push(game);
          } else {
            this.games.splice(index, 1, game);
          }
          const sessionStore = useSessionStore();
          if (game?.id === sessionStore?.game?.id) {
            sessionStore.setGame(game)
          }
        }
      },
      resetGames() {
        this.games = []
      }
  },
});

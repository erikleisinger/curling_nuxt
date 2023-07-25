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
      const client = useSupabaseClient();
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
        const client = useSupabaseClient<Database>();
        const {data, error} = await client.rpc('get_games')  as SupabaseGameReturn
          if (error) {
            const {setBanner} = useBanner();
            setBanner("Error getting games.", BannerColors.Negative);
          } else if (data) {
            this.games =  data ?? [];
          }
      },
      /**
       * 
       * @param id - id of a game to fetch
       * @param noCache - if `false` (by default), will check local cache first and only query if the game is not found. `true` means we fetch a fresh game from the database.
       * 
       * @returns {Game | null}
       */
      async getGame(id: number | null, noCache: boolean = false) {
        if (!noCache) {
            const game = this.games.find((g) => g.id === id);
            if (game) return game;
        }
        const client = useSupabaseClient<Database>();
        const {getQuery} = useDatabase()
        const {data, error} = await client.from(TABLE_NAMES.GAMES)
        .select(getQuery(TABLE_NAMES.GAMES))
        .eq('id', id) as SupabaseGameReturn
        if (data) {
            const [game] = data || [];
            return game
        }
        return null
      },
      async insertGame(game: Game) {
        const client = useSupabaseClient<Database>();
        const {getQuery} = useDatabase();
        const {data, error} = await client
          .from(TABLE_NAMES.GAMES)
          .upsert(game)
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

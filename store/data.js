import {defineStore} from "pinia";
import {TABLE_NAMES} from "@/constants/tables";
import {useBannerStore} from "@/store/banner";
import {useStorage} from "@vueuse/core";

export const useDataStore = defineStore("data", {
  state: () => ({
    games: useStorage("games", []),
    players: useStorage("players", []),
    shotTypes: useStorage("shotTypes", []),
    teams: useStorage("teams", []),
  }),
  actions: {
    async fetchPlayers(force = false) {
      if (this.players.length && !force) return;
      const client = useSupabaseAuthClient();
      const {data} = await client.from(TABLE_NAMES.PLAYERS).select("*");
      const errors = false;
      if (errors) {
        const bannerStore = useBannerStore();
        bannerStore.setText("Error getting players.");
      } else if (data) {
        this.players = data;
      }
    },
    async fetchShotTypes() {
      const client = useSupabaseAuthClient();
      const {data} = await client.from(TABLE_NAMES.SHOT_TYPES).select("*");
      const errors = false;
      if (errors) {
        const bannerStore = useBannerStore();
        bannerStore.setText("Error getting shot types.");
      } else if (data) {
        const shotTypes = data.map((st) => {
          const {id, name} = st;
          return {
            value: id,
            label: name,
          };
        });
        this.shotTypes = shotTypes;
      }
    },
    async getGames(force) {
      if (this.games?.length && !force) return;
      const {getUser, getQuery} = useDatabase();
      const {id} = getUser() ?? {};
      const client = useSupabaseAuthClient();
      const {data, error} = await client
        .from(TABLE_NAMES.GAMES)
        .select(getQuery(TABLE_NAMES.GAMES))
        .eq("profile_id", id);
      if (error) return;
      const gamesRaw = data ?? [];
      const {gameModel} = useModel();
      this.games = gamesRaw.map((g) => gameModel(g));
    },
    async getShotTypes() {
      if (this.shotTypes?.length) return;
      await this.fetchShotTypes();
    },
    async getTeams(force = false) {
      if (this.teams.length && !force) return;
      const client = useSupabaseAuthClient();
      const {getUser} = useDatabase();
      const {id} = getUser() ?? {};
      const {data} = await client
        .from(TABLE_NAMES.TEAMS)
        .select("*")
        .eq("profile_id", id);
      this.teams = data;
    },
    async insertGame(game) {
      const client = useSupabaseAuthClient();
      const {getUser, getQuery} = useDatabase();
      const {id} = getUser() ?? {};
      const {data, error} = await client
        .from(TABLE_NAMES.GAMES)
        .upsert({
          ...game,
          profile_id: id,
        })
        .select(getQuery(TABLE_NAMES.GAMES));
      if (error) {
        const {code} = error || {};
        const bannerStore = useBannerStore();
        bannerStore.setText(`Error creating game (code ${code})`, "negative");
      } else {
        const [game] = data;
        const {gameModel} = useModel();
        const index = this.games.findIndex((g) => g.id === game.id);
        if (index === -1) {
          this.games.push(gameModel(game));
        } else {
          this.games.splice(index, 1, gameModel(game));
        }
      }
    },
    async insertPlayer(player) {
      const client = useSupabaseAuthClient();
      const {getUser} = useDatabase();
      const {id} = getUser() ?? {};
      const {data, error} = await client
        .from(TABLE_NAMES.PLAYERS)
        .upsert({
          ...player,
          profile_id: id,
        })
        .select();
        if (error) {
          const {code} = error || {};
        const bannerStore = useBannerStore();
        bannerStore.setText(`Error creating player (code ${code})`, "negative");
        } else {
          const [player] = data;
          const index = this.players.findIndex((g) => g.id === player.id);
          if (index === -1) {
            this.players.push(player);
          } else {
            this.players.splice(index, 1, player);
          }
        }
    }
  },
});

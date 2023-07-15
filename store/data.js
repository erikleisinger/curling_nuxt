import {defineStore} from "pinia";
import {TABLE_NAMES} from "@/constants/tables";
import {useBannerStore} from "@/store/banner";
import {useGameStore} from "@/store/game"
import {useStorage} from "@vueuse/core";

export const useDataStore = defineStore("data", {
  state: () => ({
    games: useStorage("games", []),
    players: useStorage("players", []),
    shotTypes: useStorage("shotTypes", []),
    teams: useStorage("teams", []),
  }),
  actions: {
    async deleteItem(id, resourceType) {
      const client = useSupabaseAuthClient();
      const {data, error} = await client.from(resourceType.toLowerCase()).delete().eq('id', id)
      if (error) {
        const {code} = error || {};
        const bannerStore = useBannerStore();
        bannerStore.setText(`Error deleting game (code ${code})`, "negative");
      } else {
        const index = this[resourceType].findIndex((g) => g.id === id);
        if (index === -1) return;
        this[resourceType].splice(index, 1)
      }
    },
    async initData() {
      const {setLoading} = useGameStore();
      setLoading(true)
      await this.fetchPlayers();
      await this.fetchShotTypes();
      await this.getTeams(true);
      setLoading(false)
    },
    async fetchPlayers(force = false) {
      if (this.players.length && !force) return;
      const client = useSupabaseAuthClient();
      const {data} = await client.from(TABLE_NAMES.PLAYERS).select("*");
      const errors = false;
      if (errors) {
        const bannerStore = useBannerStore();
        bannerStore.setText("Error getting players.");
      } else if (data) {
        this.players = data.sort((a,b) => a?.name?.toLowerCase() - b?.name?.toLowerCase())
      }
    },
    async fetchShotTypes(force) {
      if (this.shotTypes.length && !force) return;

      const client = useSupabaseAuthClient();
      const {getUser} = useDatabase()
      const {id} = getUser();
      const {data} = await client.from(TABLE_NAMES.SHOT_TYPES).select(`
      id,
      name,
      shot_type
      `).or(`profile_id.eq.${id},is_global.eq.true`)
      const errors = false;
      if (errors) {
        const bannerStore = useBannerStore();
        bannerStore.setText("Error getting shot types.");
      } else if (data) {
        this.shotTypes = data
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
    async getTeams(force = false) {
      if (this.teams.length && !force) return;
      const client = useSupabaseAuthClient();
      const {getUser, getQuery} = useDatabase();
      const {id} = getUser() ?? {};
      const {data} = await client
        .from(TABLE_NAMES.TEAMS)
        .select(getQuery(TABLE_NAMES.TEAMS))
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
        const gameStore = useGameStore();
        if (game?.id === gameStore?.game?.id) {
        
          gameStore.setGame(game)
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
    },
    async insertTeam(team) {
      const client = useSupabaseAuthClient();
      const {getUser, getQuery} = useDatabase();
      const {id} = getUser() ?? {};
      const {data, error} = await client
        .from(TABLE_NAMES.TEAMS)
        .upsert({
          ...team,
          profile_id: id,
        })
        .select(getQuery(TABLE_NAMES.TEAMS));
        if (error) {
          const {code} = error || {};
        const bannerStore = useBannerStore();
        bannerStore.setText(`Error creating team (code ${code})`, "negative");
        } else {
          const [team] = data;
          const index = this.teams.findIndex((g) => g.id === team.id);
          if (index === -1) {
            this.teams.push(team);
          } else {
            this.teams.splice(index, 1, team);
          }
        }
    },
    async insertShotType(shotType) {
      const client = useSupabaseAuthClient();
      const {getUser, getQuery} = useDatabase();
      const {id} = getUser() ?? {};
      const {data, error} = await client
        .from(TABLE_NAMES.SHOT_TYPES)
        .upsert({
          ...shotType,
          profile_id: id,
        })
        .select(getQuery(TABLE_NAMES.SHOT_TYPES));
        if (error) {
          const {code} = error || {};
        const bannerStore = useBannerStore();
        bannerStore.setText(`Error creating shot type (code ${code})`, "negative");
        } else {
          const [st] = data;
          const index = this.shotTypes.findIndex((s) => s.id === st.id);
          if (index === -1) {
            this.shotTypes.push(st);
          } else {
            this.shotTypes.splice(index, 1, st);
          }
        }
    }
  },
});

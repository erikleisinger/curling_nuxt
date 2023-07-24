import {defineStore} from "pinia";
import {TABLE_NAMES} from "@/constants/tables";
import {useStorage} from "@vueuse/core";
import {useBannerStore} from "@/store/banner";
import {useTeamStore} from "@/store/teams";
import {newShot} from "@/models/shot";
import type End from "@/types/end";
import type Shot from "@/types/shot";
import type Game from "@/types/game";
import type {Database} from "@/types/supabase";
import type { SupabaseShotReturn } from "types/fetch";
import { BannerColors } from "@/types/color";

export const useSessionStore = defineStore("session", {
  state: () => ({
    end: 1,
    ends: useStorage("ends", [] as End[]),
    game: useStorage("game", {} as Game | null),
    loading: false,
    promptScore: false,
    shot: 1,
    shots: useStorage("shots", [] as Shot[]),
  }),
  getters: {
    currentShot(): Shot | null {
      if (!this.game) return null;
      const shot = this.shots.find(
        (s) => s.shot_no === this.shot && s.end_id === this.currentEnd?.id
      );
      if (shot) return shot;
      const {newShot} = useModel();
      return newShot({end_id: this.currentEnd?.id, shot_no: this.shot});
    },
    currentEnd: (state): End | undefined => {
      return state.ends.find(({end_number}) => end_number === state.end);
    },
    getShotByNumberAndEnd() {
      return (shot_no: number, end_id: number) =>
        this.shots.find((s) => s.shot_no === shot_no && s.end_id === end_id);
    },
    getThrowingTeamId(): (arg: number) => number | null {
      return (shot_no: number) => {
        if (!this.whoThrowsFirst) return null;
        if (shot_no % 2 === 0) {
          return this.whoThrowsFirst === "home"
            ? this.game?.away?.id
            : this.game?.home?.id;
        }
        return this.whoThrowsFirst === "home"
          ? this.game?.home?.id
          : this.game?.away?.id;
      };
    },
    getCurrentThrower(): number | null {
      const teamStore = useTeamStore();
      const shotNo: number = this.shot;
      const currentTeam = teamStore.teams.find(
        (t) => t.id === this.getThrowingTeamId(shotNo)
      );
      if (shotNo <= 4) {
        return currentTeam?.lead_player_id?.id ?? null;
      } else if (shotNo <= 8) {
        return currentTeam?.second_player_id?.id ?? null;
      } else if (shotNo <= 12) {
        return currentTeam?.third_player_id?.id ?? null;
      } else if (shotNo <= 16) {
        return currentTeam?.fourth_player_id?.id ?? null;
      }
      return null;
    },
    getShotColor() {
      return (shot_no: number) => {
        const whoThrowsFirst = this.whoThrowsFirst;
      if (!whoThrowsFirst) return null;
        if (shot_no % 2 === 0) {
          return whoThrowsFirst === "home"
            ? this.game.away_color
            : this.game.home_color;
        }
        return whoThrowsFirst === "home"
          ? this.game.home_color
          : this.game.away_color;
      };
    },
    whoThrowsFirst(): string | null {
      if (!this.game?.id) return null;
      const {hammer_first_end} = this.game || {};
      const {id} = hammer_first_end || {};
      if (this.end === 1) return this.game.away.id === id ? "home" : "away";
      const whoScoredLast = [...this.ends]
        .filter((e) => e.end_number < this.end)
        .sort((a, b) => a.end_number - b.end_number)
        .reduce((id: number | null | undefined, current: End) => {
          if (
            current?.points_scored === null ||
            current?.points_scored === undefined
          )
            return id;
          if (current.points_scored > 0) return current.scoring_team_id;
          return id;
        }, id as number | null | undefined);
      return this.game.away.id === whoScoredLast ? "away" : "home";
    },
  },
  actions: {
    async createEnd(gameId: number, endNo: number) {
      const client = useSupabaseAuthClient<Database>();
      const {data, error} = await client
        .from(TABLE_NAMES.ENDS)
        .insert({game_id: Number(gameId), end_number: Number(endNo)})
        .select("*");
      if (error) return null;
      const [end] = data;
      return end;
    },
    async createShot(endId: number, endNumber: number, shotNo: number) {
      const shotToCreate: Shot = {
        ...newShot(),
        end_id: Number(endId),
        shot_no: Number(shotNo),
        player_id: this.getCurrentThrower,
      };
      if (shotNo !== 1) {
        const previousShot = await this.getShot(shotNo - 1, endNumber);
        shotToCreate["rock_positions"] = previousShot.rock_positions;
      }
      return shotToCreate;
    },
    async getEnd(endNo: number) {
      const {id: gameId} = this.game;
      const endInStore = this.ends.find(
        (e) => e.end_number === endNo && e.game_id === gameId
      );
      if (endInStore) return endInStore;
      const client = useSupabaseAuthClient<Database>();
      if (!gameId) return;
      let end;
      const {data, error} = await client
        .from(TABLE_NAMES.ENDS)
        .select(
          `
        id,
        game_id,
        end_number,
        scoring_team_id,
        points_scored
        `
        )
        .eq("end_number", endNo)
        .eq("game_id", gameId);
      if (!data?.length || error) {
        end = await this.createEnd(gameId, endNo);
      } else {
        const [fetchedEnd] = data;
        end = fetchedEnd;
      }
      this.ends.push(end);
      return end;
    },
    async getShot(shotNo: number, endNo: number): Promise<Shot> {
      const end = await this.getEnd(endNo);
      const {id: end_id, end_number} = end;
      const shotInStore = this.shots.find(
        (s) => s.end_id === end_id && s.shot_no === shotNo
      );
      if (shotInStore) return shotInStore;

      const client = useSupabaseAuthClient<Database>();
      let shot;
      const {getQuery} = useDatabase();
      const {data} = await client
        .from(TABLE_NAMES.SHOTS)
        .select(getQuery(TABLE_NAMES.SHOTS))
        .eq("end_id", end_id)
        .eq("shot_no", shotNo) as SupabaseShotReturn
      if (!data?.length) {
        shot = await this.createShot(end_id, end_number, shotNo);
      } else {
        const [fetchedShot] = data;
        shot = fetchedShot;
      }
      const shotToInsert = {
        ...shot,
        end_id: shot.end_id,
        player_id: shot.player_id,
      };
      this.insertShot(shotToInsert);
      return shot;
    },
    async initGame() {
      this.setLoading(true);
      this.end = 1;
      this.shot = 1;
      const {id: game_id,} = this.game;
      const client = useSupabaseAuthClient<Database>();
      const {data: gameData, error} = await client
        .from(TABLE_NAMES.ENDS)
        .select(
          `
            id,
            game_id,
            end_number,
            scoring_team_id,
            points_scored,
            shots(
                id,
                end_id,
                player_id,
                shot_no,
                turn,
                line,
                score,
                type_id,
                notes,
                rock_positions
            )
        `
        )
        .eq("game_id", game_id);
    if (error) {
        const {code} = error || {};
        const {setBanner} = useBanner()
        setBanner(`Error initializing game (code ${code})`, BannerColors.Negative);
    
        return
    }
      const {shots, ends} = gameData.reduce(
        (all, current:End) => {
          const {shots: incomingShots, ...end} = current;
          return {
            shots: [...all.shots, ...(incomingShots ?? [])],
            ends: [...all.ends, end],
          };
        },
        {shots: [], ends: []} as {shots: Shot[], ends: End[]}
      );
      this.ends = ends;
      this.shots = shots;
      await this.getShot(this.shot, this.end);
      this.setLoading(false);
    },
    insertShot(shot:Shot) {
      const index = this.shots.findIndex(
        (s) => s.shot_no === shot.shot_no && s.end_id === shot.end_id
      );
      if (index === -1) {
        this.shots.push(shot);
      } else {
        this.shots.splice(index, 1, shot);
      }
    },
    async prevShot() {
      this.setLoading(true);
      if (!(this.shot === 1 && this.end === 1)) {
        if (this.shot === 1) {
          this.end -= 1;
          this.shot = 16;
        } else {
          this.shot -= 1;
        }
      }

      await this.getShot(this.shot, this.end);
      this.setLoading(false);
    },
    async nextShot() {
      this.setLoading(true);
      if (this.shot === 16) {
        this.shot = 1;
        this.end += 1;
      } else {
        this.shot += 1;
      }
      await this.getShot(this.shot, this.end);
      this.setLoading(false);
    },
    async goToShot(shotNo:number, endNo:number) {
      this.setLoading(true);
      this.shot = shotNo;
      this.end = endNo;
      await this.getShot(shotNo, endNo);
      this.setLoading(false);
    },
 
    async saveShot(shot:Shot) {
      const {objTheSame} = useValidation();
      const rockInStore = this.shots.find(
        (s) => s.shot_no === shot.shot_no && s.end_id === shot.end_id
      );
      if (rockInStore && objTheSame(rockInStore, shot)) return;
      if (!shot.id) delete shot.id;
      this.setLoading(true);
      const client = useSupabaseAuthClient<Database>();
      const {getQuery} = useDatabase();
      const {data, error} = await client
        .from(TABLE_NAMES.SHOTS)
        .upsert(
          {
            ...shot,
            end_id: shot.end_id,
            player_id: shot.player_id,
          },
          {onConflict: "end_id, shot_no"}
        ) 
        .select(getQuery(TABLE_NAMES.SHOTS)) as SupabaseShotReturn
        if (!data?.length || error) {
            const {code} = error || {};
        const {setBanner} = useBanner()
        setBanner(`Error saving game (code ${code})`, BannerColors.Negative);
    
        return
        }
      const [savedShot] = data;
      if (!savedShot) return;
      this.insertShot(savedShot);
      this.setLoading(false);
    },
    setGame(game:Game) {
      this.setLoading(true);
      this.game = game;
      this.setLoading(false);
    },
    setLoading(bool:boolean) {
      this.loading = bool;
    },
    async updateScore(points_scored: number, end_number:number, scoring_team_id:number, game_id:number) {
      const client = useSupabaseAuthClient<Database>();
      const {data, error} = await client.from(TABLE_NAMES.ENDS).upsert(
        {
          end_number,
          scoring_team_id,
          points_scored,
          game_id,
        },
        {ignoreDuplicates: false, onConflict: "game_id, end_number"}
      ).select(`
        id,
            game_id,
            end_number,
            scoring_team_id,
            points_scored
            `);
      if (error) {
        const {code} = error || {};
        const bannerStore = useBannerStore();
        bannerStore.setText(`Error updating score (code ${code})`, BannerColors.Negative);
        return;
      }
      const [end] = data;
      if (!end) return;
      const index = this.ends.findIndex(
        (g) => g.game_id === game_id && g.end_number === end_number
      );
      if (index === -1) {
        this.ends.push(end);
      } else {
        this.ends.splice(index, 1, end);
      }
    },
    resetSession() {
      this.game = null;
      this.shots = [];
      this.shot = 1;
      this.end = 1;
      this.ends = []

    },
  },
});

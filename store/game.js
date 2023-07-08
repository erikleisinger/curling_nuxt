import {defineStore} from "pinia";
import { TABLE_NAMES } from "@/constants/tables";
import { useStorage } from '@vueuse/core'
import {useBannerStore} from '@/store/banner'

export const useGameStore = defineStore("game", {
  state: () => ({
      end: 1,
      ends: useStorage('ends', []),
      game: useStorage('game', {}),
      loading: false,
      promptScore: false,
      shot: 1,
      shots: useStorage('shots', []),
  }),
  getters: {
    currentShot: (state) => {
        return state.shots.find((s) => s.shot_no === state.shot)
    }
  },
  actions: {
    async createEnd(gameId) {
        const client = useSupabaseAuthClient()
        const {data, error} = await client.from(TABLE_NAMES.ENDS).insert({'game_id': Number(gameId), 'end_number': Number(this.end)}).select('*');
        if (error) return null;
        const [end] = data;
        return end;
    },
    async createShot(endId, currentShot) {
        const client = useSupabaseAuthClient()
        const insertData = {'end_id': Number(endId), 'shot_no': Number(this.shot)}
        if (currentShot) {
            insertData['rock_positions'] = currentShot.rock_positions
        }
        const {data, error} = await client.from(TABLE_NAMES.SHOTS).insert(insertData).select('*');
        if (error) return null;
        const [shot] = data;
        return shot;
    },
    async getEnd() {
        const {id: gameId} = this.game;
        const endInStore = this.ends.find((e) => e.end_number === this.end);
        if (endInStore) return endInStore;
        const client = useSupabaseAuthClient()
        if (!gameId) return;
        let end;
        const {data} = await client.from(TABLE_NAMES.ENDS).select(`
        id,
        end_number,
        scoring_team_id,
        points_scored
        `).eq('end_number', this.end).eq('game_id', gameId)
        if (!data?.length) {
            end = await this.createEnd(gameId);
        } else {
            const [fetchedEnd] = data;
            end = fetchedEnd
        }
        this.ends.push(end)
        return end;
    },
    async getShot(currentShot) {
        const end = await this.getEnd()
        const {id: end_id} = end;
        const shotInStore = this.shots.find((s) => s.end_id === end_id && s.shot_no === this.shot);
        if (shotInStore) return shotInStore;
        const client = useSupabaseAuthClient();
        let shot;
        const {data} = await client.from(TABLE_NAMES.SHOTS).select('*').eq('end_id', end_id).eq('shot_no', this.shot).select('*')
        if (!data?.length) {
            shot = await this.createShot(end_id, currentShot);
        } else {
            const [fetchedShot] = data;
            shot = fetchedShot
        };
        this.insertShot(shot)
        return shot;
    },
    async initGame() {
        if (this.shots.length && this.ends.length) return;
        const {id: game_id} = this.game;
        const client = useSupabaseAuthClient();
        const {data:gameData} = await client.from(TABLE_NAMES.ENDS).select(`
            id,
            game_id,
            end_number,
            scoring_team_id (
                id,
                name
            ),
            points_scored,
            shots(*)
        `).eq('game_id', game_id)
        const {shots, ends} = gameData.reduce((all, current) => {
            const {shots: incomingShots, ...end} = current
            return {
                shots: [...all.shots, ...incomingShots],
                ends: [...all.ends, end]
            }
        }, {shots: [], ends: []})
        this.ends = ends;
        this.shots = shots;
    },  
    insertShot(shot) {
        const index = this.shots.findIndex((s) => s.id === shot.id);
        if (index === -1) {
            this.shots.push(shot)
        } else {
            this.shots.splice(index, 1, shot)
        }
    },
    async prevShot(currentShot) {
        this.loading = true;
        if (!(this.shot === 1 && this.end === 1)) {
            if (this.shot === 1) {
                this.end -= 1;
                this.shot = 16
            } else {
                this.shot -=1
            }
        }
     
   
        await this.getShot(currentShot)
        this.loading = false;
    },
    async nextShot(currentShot) {
        this.loading = true;
        if (this.shot === 16) {
            this.shot = 1;
            this.end += 1;
        } else {
            this.shot +=1;
        }
        await this.getShot(currentShot)
        this.loading = false;
    },
    resetStore() {
        localStorage.removeItem('ends')
        localStorage.removeItem('shots')
        localStorage.removeItem('game')
    },
    async saveShot(shot) {  
        const {objTheSame} = useValidation();
        const rockInStore = this.shots.find((s) => s.shot_no === shot.shot_no && s.end_id === shot.end_id)
        if (objTheSame(rockInStore, shot)) return;
        this.loading = true;
        const client = useSupabaseAuthClient();
        const {data}= await client.from(TABLE_NAMES.SHOTS).upsert(shot).select(`*`)
        const [savedShot] = data;
        if (!savedShot) return;
        this.insertShot(savedShot)
        this.loading = false;
    },
    setGame(game) {
      this.game = game;
    },
    async updateScore(points_scored, end_number, scoring_team_id, game_id) {
        const client = useSupabaseAuthClient();
        const {data, error} = await client.from(TABLE_NAMES.ENDS).upsert({
            end_number,
            scoring_team_id,
            points_scored,
            game_id,
        }, {ignoreDuplicates: false, onConflict: 'game_id, end_number'}).select(`
        id,
            game_id,
            end_number,
            scoring_team_id (
                id,
                name
            ),
            points_scored
            `)
        if (error) {
            const {code} = error || {};
            const bannerStore = useBannerStore();
            bannerStore.setText(`Error updating score (code ${code})`, 'negative')
            return;
        }
        const [end] = data;
        if (!end) return
        const index = this.ends.findIndex((g) => g.game_id === game_id && g.end_number === end_number);
        if (index === -1) {
            this.ends.push(end)
        } else {
            this.ends.splice(index, 1, end)
        }
    },  
  },
},
);

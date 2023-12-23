import {Model} from 'pinia-orm'
import League from '@/store/models/league';
import Player from '@/store/models/player';

export default class LeagueAdmin extends Model {
    static entity = 'league-admin';

    static primaryKey = ['league_id', 'profile_id']

    static fields() {
        return {
            id: this.number(),
            created_at: this.string(),
            league_id: this.number(),
            league: this.belongsTo(League, 'league_id'),
            profile_id: this.string(),
            profile: this.belongsTo(Player, 'profile_id')
        }
       
    }
}
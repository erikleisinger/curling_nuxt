import {Model} from 'pinia-orm'
import League from '@/store/models/league';
import LeagueTeam from '@/store/models/league-team'

export default class LeaguePool extends Model {
    static entity = 'league-pool';

    static fields() {
        return {
            id: this.number(),
            created_at: this.string(),
            name: this.string(),
            format: this.string(),
            league_id: this.number(),
            league: this.belongsTo(League, 'league_id'),
            teams: this.hasMany(LeagueTeam, 'league_pool_id')
            
        }
       
    }
}
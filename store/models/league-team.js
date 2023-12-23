import {Model} from 'pinia-orm'
import Team from '@/store/models/team'

export default class LeagueTeam extends Model {
    static entity = 'league-team';

    static primaryKey = ['team_id', 'league_id']

    static fields() {
        return {
            id: this.number(),
            created_at: this.string(),
            league_id: this.number(),
            team_id: this.number(),
            team: this.belongsTo(Team, 'team_id')
        }
       
    }
}
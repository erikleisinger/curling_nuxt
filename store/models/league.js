import {Model} from 'pinia-orm'
import LeagueTeam from '@/store/models/league-team'
import LeagueDrawtime from '@/store/models/league-drawtime'
import LeagueAdmin from '@/store/models/league-admin';
import LeaguePool from '@/store/models/league-pool'
import Rink from '@/store/models/rink'

export default class League extends Model {
    static entity = 'leagues'

    static fields() {
        return {
            id: this.number(),
            created_at: this.string(),
            name: this.string(),
            rink_id: this.number(),
            color: this.string(),
            font_color: this.string(),
            icon: this.string(),
            teams: this.hasMany(LeagueTeam, 'league_id'),
            drawtimes: this.hasMany(LeagueDrawtime, 'league_id'),
            admins: this.hasMany(LeagueAdmin, 'league_id'),
            pools: this.hasMany(LeaguePool, 'league_id'),
            rink_id: this.number(),
            rink: this.belongsTo(Rink, 'rink_id'),
            public: this.boolean(),
        }
       
    }
}
import {Model} from 'pinia-orm'
import TeamStats from '@/store/models/team-stats';
import Game from '@/store/models/game'
import Player from '@/store/models/player'
import GameTeam from '@/store/models/game-team'
import TeamPlayer from '@/store/models/team-player'
import TeamStatsTotal from '@/store/models/team-stats-total'
import Badge from '@/store/models/badge'

export default class Team extends Model {
    static entity = 'teams'

    static fields() {
        return {
            id: this.number(),
            name: this.string('Unnamed team'),
            avatar_url: this.string(null),
            games: this.belongsToMany(Game, GameTeam, 'team_id', 'game_id'),
            players: this.belongsToMany(Player, TeamPlayer, 'team_id', 'player_id'),
            rink_id: this.number(),
            stats: this.hasMany(TeamStats, 'team_id'),
            totalStats: this.hasOne(TeamStatsTotal, 'team_id'),
            facebook: this.string(),
            instagram: this.string(),
            twitter: this.string(),
            featured_badge_id: this.number(),
            badges: this.hasMany(Badge, 'team_id'),
            text_color: this.string()
        }
       
    }
    get winPercent () {
        return Number.parseInt((this.totalStats.wins_average * 100).toFixed(2))
    }
}
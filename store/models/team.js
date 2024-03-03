import {Model} from 'pinia-orm'
import TeamStats from '@/store/models/team-stats';
import Game from '@/store/models/game'
import Player from '@/store/models/player'
import GameTeam from '@/store/models/game-team'
import TeamPlayer from '@/store/models/team-player'
import TeamStatsTotal from '@/store/models/team-stats-total'
import Badge from '@/store/models/badge'
import Rink from '@/store/models/rink'
import {Wins} from '@/store/models/stats/wins'
import { HammerEfficiency } from '@/store/models/stats/hammer-efficiency';
import {STAT_TYPES} from '@/constants/stats'


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
            rink: this.belongsTo(Rink, 'rink_id'),
            stats: this.hasMany(TeamStats, 'team_id'),
            totalStats: this.hasOne(TeamStatsTotal, 'team_id'),
            facebook: this.string(),
            instagram: this.string(),
            twitter: this.string(),
            featured_badge_id: this.number(),
            badges: this.hasMany(Badge, 'team_id'),
            text_color: this.string(),
            public: this.boolean()
        }
       
    }
    _winsCache = null;
    _hammerEfficiencyCache = null;

    get gamesPlayed() {
        return this.stats.length ?? 0;
    }

    /**
     * WIN STATS
     */

    get [STAT_TYPES.WINS]() {
        if (!this._winsCache) {
            this._winsCache = new Wins(this.stats);
        }
        return this._winsCache;
    }

    get [STAT_TYPES.HAMMER_EFFICIENCY] () {
        if (!this._hammerEfficiencyCache) {
            this._hammerEfficiencyCache = new HammerEfficiency(this.stats)
        }
        return this._hammerEfficiencyCache;
        
    }



}
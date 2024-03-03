import {CastAttribute, Model} from 'pinia-orm'
import Team from '@/store/models/team';
import TeamPlayer from '@/store/models/team-player'
import Rink from '@/store/models/rink'
import {Wins} from '@/store/models/stats/wins'
import { HammerEfficiency } from '@/store/models/stats/hammer-efficiency';
import {STAT_TYPES} from '@/constants/stats'



class FormatAvatar extends CastAttribute {
    get(value) {
      if (!value) return {};
      if (typeof value === 'string') return JSON.parse(value);
      if (typeof value === 'object') return value;
      return {}
    }
    set(value) {
      return this.get(value)
    }
  }


export default class Player extends Model {
    static entity = 'player'

    static fields() {
        return {
            id: this.string(),
            avatar: this.attr({}),
            first_name: this.string(),
            last_name: this.string(),
            rink_id: this.number(),
            rink: this.belongsTo(Rink, 'rink_id'),
            teams: this.belongsToMany(Team, TeamPlayer, 'player_id', 'team_id'),
            timezone: this.string(),
            username: this.string(),
            has_completed_tutorial: this.boolean(),
        }
       
    }

    _winsCache = null;
    _hammerEfficiencyCache = null;

    

    get teamStats () {
        return this.teams.reduce((all, {stats}) => {
            return [...all, ...stats]
        }, [])
    }

    get gamesPlayed() {
        return this.teamStats.length ?? 0
    }

    get [STAT_TYPES.WINS]() {
        if (!this._winsCache) {
            this._winsCache = new Wins(this.teamStats);
        }
        return this._winsCache;
    }

    get [STAT_TYPES.HAMMER_EFFICIENCY] () {
        if (this._hammerEfficiencyCache) return this._hammerEfficiencyCache;
        this._hammerEfficiencyCache = new HammerEfficiency(this.teamStats)
    }

    get fullName() {
        return `${this.first_name} ${this.last_name}`
    }

    static casts() {
        return {
            avatar: FormatAvatar
        }
    }
}
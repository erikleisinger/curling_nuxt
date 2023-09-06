import {CastAttribute, Model} from 'pinia-orm'
import TeamStats from '@/store/models/team-stats';
import Game from '@/store/models/game'
import GameTeam from '@/store/models/game-team'

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

export default class Team extends Model {
    static entity = 'teams'

    static fields() {
        return {
            id: this.number(),
            name: this.string('Unnamed team'),
            team_avatar: this.attr({}),
            avatar_url: this.string(null),
            avatar_type: this.string('avataaar'),
            games: this.belongsToMany(Game, GameTeam, 'team_id', 'game_id'),
            stats: this.hasMany(TeamStats, 'team_id'),
        }
       
    }


    get totalStats() {
        return this.stats.find(({game_id}) => game_id === 0)
    }

    static casts() {
        return {
            team_avatar: FormatAvatar
        }
    }
}
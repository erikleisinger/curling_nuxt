import {CastAttribute, Model} from 'pinia-orm'
import Team from '@/store/models/team';
import TeamPlayer from '@/store/models/team-player'
import Rink from '@/store/models/rink'

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
            first_name: this.string(),
            last_name: this.string(),
            username: this.string(),
            avatar: this.attr({}),
            teams: this.belongsToMany(Team, TeamPlayer, 'team_id', 'player_id'),
            rink_id: this.number(),
            rink: this.belongsTo(Rink, 'rink_id')
        }
       
    }

    static casts() {
        return {
            avatar: FormatAvatar
        }
    }
}
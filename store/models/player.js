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



    

    get teamStats () {
        return this.teams?.reduce((all, {stats}) => {
            return [...all, ...stats]
        }, [])
    }

    get gamesPlayed() {
        return this.teamStats.length ?? 0
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
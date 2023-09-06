import {CastAttribute, Model} from 'pinia-orm'
import Team from '@/store/models/team'

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

export default class TeamStats extends Model {
    static entity = 'team-stats'

    static primaryKey = ['team_id', 'game_id']

    static fields() {
        return {
            ends_against: this.number(0),
            ends_for: this.number(0),
            ends_played: this.number(0),
            games_played: this.number(0),
            hammer_blank_count: this.number(0),
            hammer_conversion_count: this.number(0),
            hammer_end_count: this.number(0),
            hammer_first_end_count: this.number(0),
            hammer_force_count: this.number(0),
            hammer_last_end_count: this.number(0),
            hammer_steal_count: this.number(0),
            loss: this.number(0),
            non_hammer_blank_count: this.number(0),
            non_hammer_end_count: this.number(0),
            non_hammer_force_count: this.number(0),
            non_hammer_steal_count: this.number(0),
            points_against: this.number(0),
            points_for: this.number(0),
            tie: this.number(0),
            win: this.number(0),
            team_id: this.number(),
            game_id: this.number(),
        }
       
    }
}
import { CastAttribute, Model } from "pinia-orm";
import Team from "@/store/models/team";

// class FormatAvatar extends CastAttribute {
//     get(value) {
//       if (!value) return {};
//       if (typeof value === 'string') return JSON.parse(value);
//       if (typeof value === 'object') return value;
//       return {}
//     }
//     set(value) {
//       return this.get(value)
//     }
//   }

export default class GameTeam extends Model {
    static entity = "game-teams";

    static primaryKey = ['game_id', 'team_id']

    static fields() {
        return {
            id: this.number(),
            game_id: this.number(),
            team_id: this.number(),
            color: this.string('red'),
            team: this.hasOne(Team, 'team_id'),
            points_scored: this.number(),
            pending: this.boolean()
        };
    }
}

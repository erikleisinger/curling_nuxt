import { CastAttribute, Model } from "pinia-orm";
import Team from "@/store/models/team";
import GameTeam from '@/store/models/game-team'

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

export default class Game extends Model {
    static entity = "games";

    static fields() {
        return {
            id: this.number(),
            name: this.string("Unnamed game"),
            teams: this.hasMany(GameTeam, 'game_id'),
            end_count: this.number()
        };
    }
}

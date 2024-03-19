import { Model } from "pinia-orm";
import Team from "@/store/models/team";
import Game from "@/store/models/team";
import {EPHEMERAL_BADGES} from '@/presentation/constants/badges'

export default class Badge extends Model {
    static entity = "badges";

    static fields() {
        return {
            id: this.number(),
            name: this.string(),
            created_at: this.string(),
            game_id: this.number(),
            team_id: this.number(),
            game: this.belongsTo(Game, 'game_id'),
            team: this.belongsTo(Team, 'team_id'),
            info: this.attr()
        };
    }

    get isBlackBadge() {
        return EPHEMERAL_BADGES.includes(this.name)
    }
}

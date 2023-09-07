import { Model } from "pinia-orm";
import Team from "@/store/models/team";
import Game from "@/store/models/team";

export default class GameTeam extends Model {
    static entity = "game-teams";

    static primaryKey = ['game_id', 'team_id']

    static fields() {
        return {
            id: this.number(),
            game_id: this.number(),
            team_id: this.number(),
            color: this.string('red'),
            team: this.belongsTo(Team, 'team_id'),
            game: this.belongsTo(Game, 'game_id'),
            points_scored: this.number(),
            pending: this.boolean()
        };
    }
    get isPlaceholder() {
        return this.game_id + 100000000 === this.team_id;
    }
}

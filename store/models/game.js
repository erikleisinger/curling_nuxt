import { CastAttribute, Model } from "pinia-orm";
import Team from "@/store/models/team";
import GameTeam from '@/store/models/game-team'

export default class Game extends Model {
    static entity = "games";

    static fields() {
        return {
            id: this.number(),
            name: this.string("Unnamed game"),
            teams: this.hasMany(GameTeam, 'game_id', 'id'),
            end_count: this.number()
        };
    }

    get isVerified() {
        return this.teams.every(({pending}) => !pending)
    }
}

import {Model } from "pinia-orm";
import Team from "@/store/models/team";
import Player from "@/store/models/player";


export default class TeamPlayer extends Model {
    static entity = "team-players";

    static primaryKey = ['team_id', 'player_id']

    static fields() {
        return {
            id: this.number(),
            team_id: this.number(),
            player_id: this.string(),
            team: this.belongsTo(Team, 'team_id'),
            player: this.belongsTo(Player, 'player_id'),
            status: this.string()
        };
    }
}

import {Model } from "pinia-orm";
import Team from "@/store/models/team";
import Rink from "@/store/models/rink";


export default class TeamRink extends Model {
    static entity = "team-rinks";

    static primaryKey = ['team_id', 'rink_id']

    static fields() {
        return {
            id: this.number(),
            team_id: this.number(),
            rink_id: this.number(),
            team: this.belongsTo(Team, 'team_id'),
            rink: this.belongsTo(Rink, 'rink_id'),
        };
    }
}

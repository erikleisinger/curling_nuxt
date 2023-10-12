import { Model } from "pinia-orm";
import GameTeam from '@/store/models/game-team'
import Rink from '@/store/models/rink'

export default class Game extends Model {
    static entity = "games";

    static fields() {
        return {
            id: this.number(),
            name: this.string("Unnamed game"),
            teams: this.hasMany(GameTeam, 'game_id', 'id'),
            end_count: this.number(),
            hammer_first_end: this.number(),
            rink: this.hasOne(Rink, 'id'),
            start_time: this.number()
        };
    }

    get isVerified() {
        return this.teams.every(({pending}) => !pending)
    }
}

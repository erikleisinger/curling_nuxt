import { Model } from "pinia-orm";
import GameTeam from '@/store/models/game-team'
import Rink from '@/store/models/rink'
import Sheet from '@/store/models/sheet'
import League from '@/store/models/league'

export default class Game extends Model {
    static entity = "games";

    static fields() {
        return {
            id: this.number(),
            name: this.string("Unnamed game"),
            teams: this.hasMany(GameTeam, 'game_id', 'id'),
            end_count: this.number(),
            hammer_first_end: this.number(),
            rink_id: this.number(),
            sheet_id: this.number(),
            rink: this.belongsTo(Rink, 'rink_id'),
            sheet: this.belongsTo(Sheet, 'sheet_id'),
            start_time: this.number(),
            note: this.string(),
            league_id: this.number(),
            league: this.belongsTo(League, 'league_id')
        };
    }

    get isVerified() {
        return this.teams.every(({pending}) => !pending)
    }
}

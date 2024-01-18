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
            teams: this.hasMany(GameTeam, 'game_id', 'id'),
            hammer_first_end: this.number(),
            end_count: this.number(),
            ends_played: this.number(),
            rink_id: this.number(),
            sheet_id: this.number(),
            rink: this.belongsTo(Rink, 'rink_id'),
            sheet: this.belongsTo(Sheet, 'sheet_id'),
            start_time: this.number(),
            note: this.string(),
            league_id: this.number(),
            league: this.belongsTo(League, 'league_id'),
            end_early: this.boolean(),
            conceded: this.boolean()
        };
    }

    get isVerified() {
        return this.teams.every(({pending}) => !pending)
    }
}

import {Model} from 'pinia-orm'
import League from '@/store/models/league';
import Game from '@/store/models/game';
import LeagueDrawtime from '@/store/models/league-drawtime';

export default class LeagueGame extends Model {
    static entity = 'league-game';

    static primaryKey = ['game_id', 'league_id']

    static fields() {
        return {
            id: this.number(),
            created_at: this.string(),
            league_id: this.number(),
            league: this.belongsTo(League, 'league_id'),
            game_id: this.number(),
            game: this.belongsTo(Game, 'game_id'),
            league_drawtime_id: this.number(),
            league_drawtime: this.belongsTo(LeagueDrawtime, 'league_drawtime_id')
        }
       
    }
}
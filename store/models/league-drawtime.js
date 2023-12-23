import {Model} from 'pinia-orm'

export default class LeagueDrawtime extends Model {
    static entity = 'league-drawtime';

    static fields() {
        return {
            id: this.number(),
            created_at: this.string(),
            league_id: this.number(),
            time: this.string()
        }
       
    }
}
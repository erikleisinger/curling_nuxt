import { BasicTeam } from "./team"
interface Count {
    count: number | null
}
type EndCount = Count[]
interface Game {
    id?: number,
    start_time: Date | null | string,
    home: BasicTeam,
    away: BasicTeam,
    name: string | null,
    ends: EndCount,
    home_color: string,
    away_color: string,
    hammer_first_end: number,
    sheet_id?: number | null,
    rink_id?: number | null
    score_home?: number | null,
    score_away?: number | null
}

export interface GamePlayerJunction {
    game_id: number,
    home_lead_id: number,
    home_second_id: number,
    home_third_id: number,
    home_fourth_id: number,
    away_lead_id: number,
    away_second_id: number,
    away_third_id: number,
    away_fourth_id: number,
    away_skip_id?: number,
    home_skip_id?: number,
}
export default Game
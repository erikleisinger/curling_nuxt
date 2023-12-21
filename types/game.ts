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

interface GameScoreTeam {
    id: number;
    avatar_url: string | null;
}

export interface GameScoreInfo {
    home: GameScoreTeam;
    away: GameScoreTeam;
    homeColor: string;
    awayColor: string;
    hammerFirstEnd: number;
}

interface EndScore {
    home: number;
    away: number;
}

interface EndResult extends EndScore {
    away_conversions?: number | null;
    away_forces?: number | null;
    away_hammer?: number | null;
    away_steals?: number | null;
    home_conversions?: number | null;
    home_forces?: number | null;
    home_hammer?: number | null;
    home_steals?: number | null;
}

export interface GameScore {
    [key: number]: EndScore | EndResult;
}

7

export default Game
import { BasicTeam } from "./team"
interface Game {
    id?: number,
    start_time: Date | null,
    home: BasicTeam,
    away: BasicTeam,
    name: string | null,
    ends: number,
    home_color: string,
    away_color: string,
    hammer_first_end: BasicTeam,
}
export default Game
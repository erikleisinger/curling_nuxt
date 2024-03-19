/**
 * Game to insert into db
 */

export interface Game {
    id?: number,
    start_time: Date | null | string,
    rink_id?: number | null,
    sheet_id?: number | null,
    end_count: number,
    conceded: boolean,
    event_id?: number | null,
    league_id?: number | null,
}
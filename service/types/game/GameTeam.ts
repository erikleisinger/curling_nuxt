export interface GameTeam {
    game_id: number,
    team_id: number,
    color: string,
    pending: boolean,
    placeholder?: string | null
}
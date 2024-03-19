export interface EndScore {
    home: number | string,
    away: number | string
}

export interface EndScores {
    [key: number]: EndScore
}
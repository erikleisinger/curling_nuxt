import { MAX_NOTE_LENGTH } from "./constraints";

export const ERROR_LIBRARY = {
    MISSING_AWAY_TEAM: "games_home_fkey",
    MISSING_HOME_TEAM: "games_home_fkey",
    NOTES_LENGTH: "check_notes_length",
    UNIQUE_END_NUMBER: "uq_game_end_number",
    UNIQUE_HOME_AWAY: "check_home_away_players",
    UNIQUE_PLAYERS: "check_players_distinct",
    UNIQUE_SHOT_NUMBER: "uq_end_shot_number",
};

export const ERROR_CODES = {
    23503: [ // missing foreign key

    ],
    23505: [
        ERROR_LIBRARY.UNIQUE_END_NUMBER,
        ERROR_LIBRARY.UNIQUE_SHOT_NUMBER,

    ],
    23514: [
        ERROR_LIBRARY.NOTES_LENGTH,
        ERROR_LIBRARY.START_END_UNIQUE,
        ERROR_LIBRARY.UNIQUE_HOME_AWAY,
        ERROR_LIBRARY.UNIQUE_PLAYERS
    ]
};

export const ERROR_MESSAGES = {
    [ERROR_LIBRARY.NOTES_LENGTH]: `Notes may not surpass ${MAX_NOTE_LENGTH} characters.`,
    [ERROR_LIBRARY.UNIQUE_END_NUMBER]: 'End # already exists.',
    [ERROR_LIBRARY.UNIQUE_HOME_AWAY]: 'Teams must be different',
    [ERROR_LIBRARY.UNIQUE_PLAYERS]: "Players must be unique",
    [ERROR_LIBRARY.UNIQUE_SHOT_NUMBER]: "Shot # already exists in this end",
}
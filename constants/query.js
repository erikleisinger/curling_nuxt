import { TABLE_NAMES } from "./tables";
export const TABLE_QUERIES = {
    [TABLE_NAMES.GAMES]: `
    id,
    start_time,
    home (
      id,
      name,
      team_avatar
    ),
    away (
      id,
      name,
      team_avatar
    ),
    name,
    ends(count),
    home_color,
    away_color,
    hammer_first_end,
    completed
    `,
    [TABLE_NAMES.PLAYERS]: "*",
    [TABLE_NAMES.SHOTS]: `
    id,
    end_id,
    player_id,
    shot_no,
    turn,
    line,
    score,
    type_id,
    notes,
    rock_positions
    `,
    [TABLE_NAMES.ENDS]: `
    end_number,
    game_id (
        name,
        start_time
    ),
    scoring_team_id,
    points_scored
    `,
    [TABLE_NAMES.TEAMS]: `
    id,
    name,
    profile_id,
    lead_player_id (
        id,
        name,
        avatar,
        profile_id
    ),
    second_player_id (
        id,
        name,
        avatar,
        profile_id
    ),
    third_player_id (
        id,
        name,
        avatar,
        profile_id
    ),
    fourth_player_id (
        id,
        name,
        avatar,
        profile_id
    ),
    fifth_player_id (
        id,
        name,
        avatar,
        profile_id
    ),
    sixth_player_id (
        id,
        name,
        avatar,
        profile_id
    ),
    seventh_player_id (
        id,
        name,
        avatar,
        profile_id
    ),
    team_avatar,
    avatar_type,
    avatar_url,
    username:profile_id (
        username
    )
    `,
    [TABLE_NAMES.SHOT_TYPES]: `
    id,
    name,
    shot_type
    `,
};

export const CUSTOM_QUERIES = {
    GET_END_WITH_SHOTS: `
    id,
    game_id,
    end_number,
    scoring_team_id,
    points_scored,
    hammer_team_id,
    shots(
        id,
        end_id,
        player_id,
        shot_no,
        turn,
        line,
        score,
        type_id,
        notes,
        rock_positions
    )
    `,
};

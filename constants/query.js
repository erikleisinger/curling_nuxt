import {TABLE_NAMES} from "./tables";
export const TABLE_QUERIES = {
  [TABLE_NAMES.GAMES]: `
    id,
    start_time,
    home (
      name
    ),
    away (
      name
    ),
    name,
    ends(count)
    `,
    [TABLE_NAMES.PLAYERS]: '*',
    [TABLE_NAMES.SHOTS]: `
    end_id (
        end_number
    ),
    player_id (
        name
    ),
    shot_no,
    turn,
    line,
    score,
    type_id (
        name
    ),
    notes,
    rock_positions
    `,
    [TABLE_NAMES.ENDS]: `
    end_number,
    game_id (
        name,
        start_time
    )
    `,
    [TABLE_NAMES.TEAMS]: `
    name,
    lead_player_id (
        name
    ),
    second_player_id (
        name
    ),
    third_player_id (
        name
    ),
    fourth_player_id (
        name
    ),
    fifth_player_id (
        name
    )
    `,
    [TABLE_NAMES.SHOT_TYPES]: `
    name
    `
};
import {TABLE_NAMES} from "./tables";
export const TABLE_QUERIES = {
  [TABLE_NAMES.GAMES]: `
    id,
    start_time,
    home (
      id,
      name
    ),
    away (
      id,
      name
    ),
    name,
    ends(count),
    home_color,
    away_color,
    hammer_first_end,
    completed
    `,
    [TABLE_NAMES.PLAYERS]: '*',
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
        lead_player_id (
          id,
          name
        ),
        second_player_id (
          id,
          name
        ),
        third_player_id (
          id,
          name
        ),
        fourth_player_id (
          id,
          name
        ),
        fifth_player_id (
          id,
          name
        ),
        sixth_player_id (
          id,
          name
        ),
        seventh_player_id (
          id,
          name
        )
    `,
    [TABLE_NAMES.SHOT_TYPES]: `
    id,
    name,
    shot_type
    `
};

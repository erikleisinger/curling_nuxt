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
    hammer_first_end (
      id,
      name
    )
    `,
    [TABLE_NAMES.PLAYERS]: '*',
    [TABLE_NAMES.SHOTS]: `
    end_id (
        id,
        end_number
    ),
    player_id (
        id,
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
        )
        third_player_id (
          id,
          name
        )
        fourth_player_id (
          id,
          name
        )
        fifth_player_id (
          id,
          name
        )
        sixth_player_id (
          id,
          name
        )
        seventh_player_id (
          id,
          name
        )
    `,
    [TABLE_NAMES.SHOT_TYPES]: `
    name
    `
};

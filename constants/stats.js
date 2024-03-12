
export const STAT_TYPES = {
    HAMMER_EFFICIENCY: "hammer_e",
    STEAL_EFFICIENCY: "steal_e",
    FORCE_EFFICIENCY: "force_e",
    STEAL_DEFENSE: "steal_d",
    BLANK_ENDS: "blank",
    HAMMER_FIRST_END: "hammer_fe",
    HAMMER_LAST_END: "hammer_le",
    WINS: "wins",
    POINTS_FOR_PER_GAME: "pfg",
    POINTS_AGAINST_PER_GAME: "pag",
    ENDS_FOR_PER_GAME: "efg",
    ENDS_AGAINST_PER_GAME: "eag",
    POINTS_PER_END: "ppe",
    HAMMER_PERFORMANCE: "hp",
};

export const STAT_NAMES = {
    [STAT_TYPES.HAMMER_EFFICIENCY]: "Hammer efficiency",
    [STAT_TYPES.STEAL_EFFICIENCY]: "Steal efficiency",
    [STAT_TYPES.FORCE_EFFICIENCY]: "Force efficiency",
    [STAT_TYPES.STEAL_DEFENSE]: "Steal defense",
    [STAT_TYPES.BLANK_ENDS]: "Blank ends",
    [STAT_TYPES.HAMMER_FIRST_END]: "Hammer in first end",
    [STAT_TYPES.HAMMER_LAST_END]: "Hammer in last end",
    [STAT_TYPES.WINS]: "Win %",
    [STAT_TYPES.POINTS_FOR_PER_GAME]: "Points per game",
    [STAT_TYPES.POINTS_AGAINST_PER_GAME]: "Points against / PG",
    [STAT_TYPES.ENDS_FOR_PER_GAME]: "Ends per game",
    [STAT_TYPES.ENDS_AGAINST_PER_GAME]: "Ends against / PG",
    [STAT_TYPES.POINTS_PER_END]: "Points per end",
    [STAT_TYPES.HAMMER_PERFORMANCE]: "Hammer factor",
};

export const STAT_DESCRIPTIONS = {
    [STAT_TYPES.HAMMER_EFFICIENCY]: "Score 2+ points with hammer.",
    [STAT_TYPES.STEAL_EFFICIENCY]: "Score without hammer.",
    [STAT_TYPES.FORCE_EFFICIENCY]: "Opposition takes 1 point with hammer.",
    [STAT_TYPES.STEAL_DEFENSE]: "Prevent opposition steals.",
    [STAT_TYPES.BLANK_ENDS]: "Score 0 points with hammer.",
    [STAT_TYPES.HAMMER_FIRST_END]: "Possess hammer in end #1.",
    [STAT_TYPES.HAMMER_LAST_END]: "Possess hammer in the last end.",
    [STAT_TYPES.WINS]: "",
    [STAT_TYPES.POINTS_FOR_PER_GAME]: "Average points scored per game",
    [STAT_TYPES.POINTS_AGAINST_PER_GAME]: "Average points conceded per game",
    [STAT_TYPES.ENDS_FOR_PER_GAME]: "Ends won per game",
    [STAT_TYPES.ENDS_AGAINST_PER_GAME]: "Ends conceded per game",
    [STAT_TYPES.POINTS_PER_END]: "Average points scored per end",
    [STAT_TYPES.HAMMER_PERFORMANCE]:
        "# hammer conversions minus # steals conceded.",
};

export const STAT_COLORS = {
    [STAT_TYPES.WINS]: "yellow",
    [STAT_TYPES.POINTS_FOR_PER_GAME]: "mint",
    [STAT_TYPES.POINTS_AGAINST_PER_GAME]: "red",
    [STAT_TYPES.ENDS_FOR_PER_GAME]: "mint",
    [STAT_TYPES.ENDS_AGAINST_PER_GAME]: "red",
    [STAT_TYPES.HAMMER_EFFICIENCY]: "blue",
    [STAT_TYPES.STEAL_EFFICIENCY]: "red",
    [STAT_TYPES.FORCE_EFFICIENCY]: "purple",
    [STAT_TYPES.STEAL_DEFENSE]: "blue-grey",
    [STAT_TYPES.BLANK_ENDS]: "blue",
    [STAT_TYPES.HAMMER_LAST_END]: "blue",
    [STAT_TYPES.POINTS_PER_END]: "mint",
    [STAT_TYPES.HAMMER_PERFORMANCE]: "blue",
}
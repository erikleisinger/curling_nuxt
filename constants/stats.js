export const STAT_TYPES = {
    HAMMER_EFFICIENCY: 'hammer_e',
    STEAL_EFFICIENCY: 'steal_e',
    FORCE_EFFICIENCY: 'force_e',
    STEAL_DEFENSE: 'steal_d',
    BLANK_ENDS: 'blank',
    HAMMER_FIRST_END: 'hammer_fe',
    HAMMER_LAST_END:'hammer_le',
    WINS: 'wins',
    POINTS_PER_GAME: 'ppg',
    ENDS_PER_GAME: 'epg'
}

export const STAT_NAMES = {
    [STAT_TYPES.HAMMER_EFFICIENCY]: 'Hammer efficiency',
    [STAT_TYPES.STEAL_EFFICIENCY]: 'Steal efficiency',
    [STAT_TYPES.FORCE_EFFICIENCY]: 'Force efficiency',
    [STAT_TYPES.STEAL_DEFENSE]: 'Steal defense',
    [STAT_TYPES.BLANK_ENDS]: 'Blank ends',
    [STAT_TYPES.HAMMER_FIRST_END]: 'Hammer in first end',
    [STAT_TYPES.HAMMER_LAST_END]: 'Hammer in last end',
    [STAT_TYPES.WINS]: 'Wins',
    [STAT_TYPES.POINTS_PER_GAME]: 'Points per game',
    [STAT_TYPES.ENDS_PER_GAME]: 'Ends per game',

}

export const STAT_DESCRIPTIONS = {
    [STAT_TYPES.HAMMER_EFFICIENCY]: 'Score 2+ points with hammer.',
    [STAT_TYPES.STEAL_EFFICIENCY]: 'Score without hammer.',
    [STAT_TYPES.FORCE_EFFICIENCY]: 'Opposition takes 1 point with hammer.',
    [STAT_TYPES.STEAL_DEFENSE]: 'Prevent opposition steals.',
    [STAT_TYPES.BLANK_ENDS]: 'Score 0 points with hammer.',
    [STAT_TYPES.HAMMER_FIRST_END]: 'Possess hammer in end #1.',
    [STAT_TYPES.HAMMER_LAST_END]: 'Possess hammer in the last end.',
    [STAT_TYPES.WINS]: 'Win a game',
    [STAT_TYPES.POINTS_PER_GAME]: 'Points scored minus points conceded',
    [STAT_TYPES.ENDS_PER_GAME]: 'Ends won minus ends lost',
}

export const STAT_COLORS = {
    [STAT_TYPES.WINS]: 'yellow',
    [STAT_TYPES.POINTS_PER_GAME]: 'mint',
    [STAT_TYPES.HAMMER_EFFICIENCY]: 'blue',
    [STAT_TYPES.STEAL_EFFICIENCY]: 'red',
    [STAT_TYPES.FORCE_EFFICIENCY]: 'pink'
}

export const STAT_FIELDS_TOTAL = {
    [STAT_TYPES.WINS]: ({win}) => win,
    [STAT_TYPES.POINTS_PER_GAME]: ({points_for, points_against}) => points_for - points_against,
    [STAT_TYPES.HAMMER_EFFICIENCY]: ({
        hammer_conversion_count,
        hammer_blank_count,
        hammer_end_count,
    }) => hammer_conversion_count / (hammer_end_count - hammer_blank_count) || 0,
    [STAT_TYPES.STEAL_EFFICIENCY]:  ({
        non_hammer_steal_count,
        non_hammer_end_count,
    }) => non_hammer_steal_count / non_hammer_end_count || 0,
    [STAT_TYPES.FORCE_EFFICIENCY]: ({non_hammer_force_count, non_hammer_end_count}) => non_hammer_force_count / non_hammer_end_count || 0
}

export const NON_PERCENT_STATS = [STAT_TYPES.POINTS_PER_GAME];

export const STAT_FIELDS = {
    YELLOW: "yellow",
    BLUE: 'blue',
    RED: 'red',
    WITH_HAMMER_FE: 'with_hammer_fe',
    WITHOUT_HAMMER_FE: 'without_hammer_fe',
    WITH_HAMMER_LE: 'with_hammer_le',
    WITHOUT_HAMMER_LE: 'without_hammer_le'
};

export const STAT_FIELD_FILTER_FUNCTIONS = {
    [STAT_FIELDS.YELLOW]: ({ color }) => color === "yellow",
    [STAT_FIELDS.BLUE]: ({ color }) => color === "blue",
    [STAT_FIELDS.RED]: ({ color }) => color === "red",
    [STAT_FIELDS.WITH_HAMMER_FE]: ({ hammer_first_end_count }) => !!hammer_first_end_count,
    [STAT_FIELDS.WITHOUT_HAMMER_FE]:({ hammer_first_end_count }) => !hammer_first_end_count,
    [STAT_FIELDS.WITH_HAMMER_LE]: ({ hammer_last_end_count }) => !!hammer_last_end_count,
    [STAT_FIELDS.WITHOUT_HAMMER_LE]: ({ hammer_last_end_count }) => !hammer_last_end_count,
};

export const STAT_FIELD_TITLES = {
    [STAT_FIELDS.BLUE]: 'Blue rocks',
    [STAT_FIELDS.YELLOW]: 'Yellow rocks',
    [STAT_FIELDS.RED]: 'Red rocks',
    [STAT_FIELDS.WITH_HAMMER_FE]: 'With hammer in first end',
    [STAT_FIELDS.WITHOUT_HAMMER_FE]: 'Without hammer in first end',
    [STAT_FIELDS.WITH_HAMMER_LE]: 'With hammer in last end',
    [STAT_FIELDS.WITHOUT_HAMMER_LE]: 'Without hammer in last end'

}
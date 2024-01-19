export const STAT_TYPES = {
    HAMMER_EFFICIENCY: 'hammer_e',
    STEAL_EFFICIENCY: 'steal_e',
    FORCE_EFFICIENCY: 'force_e',
    STEAL_DEFENSE: 'steal_d',
    BLANK_ENDS: 'blank',
    HAMMER_FIRST_END: 'hammer_fe',
    HAMMER_LAST_END:'hammer_le',
    WINS: 'wins',
    POINTS_FOR_PER_GAME: 'pfg',
    POINTS_AGAINST_PER_GAME: 'pag',
    ENDS_FOR_PER_GAME: 'efg',
    ENDS_AGAINST_PER_GAME: 'eag',
    POINTS_PER_END: 'ppe',
}

export const STAT_NAMES = {
    [STAT_TYPES.HAMMER_EFFICIENCY]: 'Hammer efficiency',
    [STAT_TYPES.STEAL_EFFICIENCY]: 'Steal efficiency',
    [STAT_TYPES.FORCE_EFFICIENCY]: 'Force efficiency',
    [STAT_TYPES.STEAL_DEFENSE]: 'Steal defense',
    [STAT_TYPES.BLANK_ENDS]: 'Blank ends',
    [STAT_TYPES.HAMMER_FIRST_END]: 'Hammer in first end',
    [STAT_TYPES.HAMMER_LAST_END]: 'Hammer in last end',
    [STAT_TYPES.WINS]: 'Win %',
    [STAT_TYPES.POINTS_FOR_PER_GAME]: 'Points for / PG',
    [STAT_TYPES.POINTS_AGAINST_PER_GAME]: 'Points against / PG',
    [STAT_TYPES.ENDS_FOR_PER_GAME]: 'Ends for / PG',
    [STAT_TYPES.ENDS_AGAINST_PER_GAME]: 'Ends against / PG',
    [STAT_TYPES.POINTS_PER_END]: 'Points per end'

}

export const STAT_DESCRIPTIONS = {
    [STAT_TYPES.HAMMER_EFFICIENCY]: 'Score 2+ points with hammer.',
    [STAT_TYPES.STEAL_EFFICIENCY]: 'Score without hammer.',
    [STAT_TYPES.FORCE_EFFICIENCY]: 'Opposition takes 1 point with hammer.',
    [STAT_TYPES.STEAL_DEFENSE]: 'Prevent opposition steals.',
    [STAT_TYPES.BLANK_ENDS]: 'Score 0 points with hammer.',
    [STAT_TYPES.HAMMER_FIRST_END]: 'Possess hammer in end #1.',
    [STAT_TYPES.HAMMER_LAST_END]: 'Possess hammer in the last end.',
    [STAT_TYPES.WINS]: '',
    [STAT_TYPES.POINTS_FOR_PER_GAME]: 'Average points scored per game',
    [STAT_TYPES.POINTS_AGAINST_PER_GAME]: 'Average points conceded per game',
    [STAT_TYPES.ENDS_FOR_PER_GAME]: 'Ends won per game',
    [STAT_TYPES.ENDS_AGAINST_PER_GAME]: 'Ends conceded per game',
    [STAT_TYPES.POINTS_PER_END]: 'Average points scored per end'
}

export const STAT_COLORS = {
    [STAT_TYPES.WINS]: 'blue',
    [STAT_TYPES.POINTS_FOR_PER_GAME]: 'mint',
    [STAT_TYPES.POINTS_AGAINST_PER_GAME]: 'red',
    [STAT_TYPES.ENDS_FOR_PER_GAME]: 'mint',
    [STAT_TYPES.ENDS_AGAINST_PER_GAME]: 'red',
    [STAT_TYPES.HAMMER_EFFICIENCY]: 'blue',
    [STAT_TYPES.STEAL_EFFICIENCY]: 'blue',
    [STAT_TYPES.FORCE_EFFICIENCY]: 'blue',
    [STAT_TYPES.STEAL_DEFENSE]: 'blue',
    [STAT_TYPES.BLANK_ENDS]: 'blue',
    [STAT_TYPES.HAMMER_LAST_END]: 'blue',
    [STAT_TYPES.POINTS_PER_END]: 'blue'

}

export const STAT_FIELDS = {
    YELLOW: "yellow",
    BLUE: 'blue',
    RED: 'red',
    WITH_HAMMER_FE: 'with_hammer_fe',
    WITHOUT_HAMMER_FE: 'without_hammer_fe',
    WITH_HAMMER_LE: 'with_hammer_le',
    WITH_HAMMER_LE_TIE: 'with_hammer_le_tie',
    WITH_HAMMER_LE_U1: 'with_hammer_le_u1',
    WITH_HAMMER_LE_U2: 'with_hammer_le_u2',
    WITH_HAMMER_LE_D1: 'with_hammer_le_d1',
    WITH_HAMMER_LE_D2: 'with_hammer_le_d2',
    WITHOUT_HAMMER_LE: 'without_hammer_le',
    WITHOUT_HAMMER_LE_TIE: 'without_hammer_le_tie',
    WITHOUT_HAMMER_LE_U1: 'without_hammer_le_u1',
    WITHOUT_HAMMER_LE_U2: 'without_hammer_le_u2',
    WITHOUT_HAMMER_LE_D1: 'without_hammer_le_d1',
    WITHOUT_HAMMER_LE_D2: 'without_hammer_le_d2',
    WITH_HAMMER_2LE: 'with_hammer_2le',
    WITH_HAMMER_2LE_TIE: 'with_hammer_2le_tie',
    WITH_HAMMER_2LE_U1: 'with_hammer_2le_u1',
    WITH_HAMMER_2LE_U2: 'with_hammer_2le_u2',
    WITH_HAMMER_2LE_D1: 'with_hammer_2le_d1',
    WITH_HAMMER_2LE_D2: 'with_hammer_2le_d2',
    WITHOUT_HAMMER_2LE: 'without_hammer_2le',
    WITHOUT_HAMMER_2LE_TIE: 'without_hammer_2le_tie',
    WITHOUT_HAMMER_2LE_U1: 'without_hammer_2le_u1',
    WITHOUT_HAMMER_2LE_U2: 'without_hammer_2le_u2',
    WITHOUT_HAMMER_2LE_D1: 'without_hammer_2le_d1',
    WITHOUT_HAMMER_2LE_D2: 'without_hammer_2le_d2',
    WITH_HAMMER_3LE: 'with_hammer_3le',
    WITH_HAMMER_3LE_TIE: 'with_hammer_3le_tie',
    WITH_HAMMER_3LE_U1: 'with_hammer_3le_u1',
    WITH_HAMMER_3LE_U2: 'with_hammer_3le_u2',
    WITH_HAMMER_3LE_D1: 'with_hammer_3le_d1',
    WITH_HAMMER_3LE_D2: 'with_hammer_3le_d2',
    WITHOUT_HAMMER_3LE: 'without_hammer_3le',
    WITHOUT_HAMMER_3LE_TIE: 'without_hammer_3le_tie',
    WITHOUT_HAMMER_3LE_U1: 'without_hammer_3le_u1',
    WITHOUT_HAMMER_3LE_U2: 'without_hammer_3le_u2',
    WITHOUT_HAMMER_3LE_D1: 'without_hammer_3le_d1',
    WITHOUT_HAMMER_3LE_D2: 'without_hammer_3le_d2',
    
    WITH_HAMMER: 'with_hammer',
    WITHOUT_HAMMER: 'without_hammer',
    WITH_HAMMER_EE: 'with_hammer_ee',
    WITHOUT_HAMMER_EE: 'without_hammer_ee',

};

export const STAT_FIELDS_TOTAL = {
    [STAT_TYPES.WINS]: ({win}) => win,
    // [STAT_TYPES.POINTS_FOR_PER_GAME]: ({points_for, points_against}) => points_for - points_against,
    [STAT_TYPES.POINTS_FOR_PER_GAME]: ({points_for}) => points_for,
    [STAT_TYPES.POINTS_AGAINST_PER_GAME]: ({points_against}) => points_against,
    [STAT_TYPES.HAMMER_EFFICIENCY]: ({
        hammer_conversion_count,
        hammer_blank_count,
        hammer_end_count,
    }) => hammer_conversion_count / (hammer_end_count - hammer_blank_count) || 0,
    [STAT_TYPES.STEAL_EFFICIENCY]:  ({
        non_hammer_steal_count,
        non_hammer_end_count,
    }) => non_hammer_steal_count / non_hammer_end_count || 0,
    [STAT_TYPES.FORCE_EFFICIENCY]: ({non_hammer_force_count, non_hammer_end_count}) => non_hammer_force_count / non_hammer_end_count || 0,
    [STAT_TYPES.STEAL_DEFENSE]: ({hammer_end_count, hammer_steal_count}) => 1 - (hammer_steal_count / hammer_end_count || 0),
    [STAT_TYPES.BLANK_ENDS]: ({hammer_end_count, hammer_blank_count}) => hammer_blank_count / hammer_end_count || 0,
    [STAT_TYPES.ENDS_FOR_PER_GAME]: ({ends_for}) => ends_for,
    [STAT_TYPES.ENDS_AGAINST_PER_GAME]: ({ends_against}) => ends_against,
    [STAT_TYPES.HAMMER_LAST_END]: ({hammer_last_end_count}) => hammer_last_end_count / 1,
    [STAT_TYPES.POINTS_PER_END]: ({points_for, ends_played}) => points_for / ends_played,
    [STAT_FIELDS.WITH_HAMMER]: ({points_with_hammer, hammer_end_count}) => points_with_hammer / hammer_end_count,
    [STAT_FIELDS.WITHOUT_HAMMER]: ({points_without_hammer, non_hammer_end_count}) => points_without_hammer / non_hammer_end_count,

    [STAT_FIELDS.WITH_HAMMER_LE]: ({hammer_le, win}) => !!hammer_le && !!win ? 1 : 0,
    [STAT_FIELDS.WITH_HAMMER_LE_U2]: ({hammer_le, win}) => !!hammer_le && !!win ? 1 : 0,
    [STAT_FIELDS.WITH_HAMMER_LE_U1]: ({hammer_le, win}) => !!hammer_le && !!win ? 1 : 0,
    [STAT_FIELDS.WITH_HAMMER_LE_TIE]: ({hammer_le, win}) => !!hammer_le && !!win ? 1 : 0,
    [STAT_FIELDS.WITH_HAMMER_LE_D2]: ({hammer_le, win}) => !!hammer_le && !!win ? 1 : 0,
    [STAT_FIELDS.WITH_HAMMER_LE_D2]: ({hammer_le, win}) => !!hammer_le && !!win ? 1 : 0,

    [STAT_FIELDS.WITHOUT_HAMMER_LE]: ({hammer_le, win}) => !hammer_le && !!win ? 1 : 0,
    [STAT_FIELDS.WITHOUT_HAMMER_LE_U2]: ({hammer_le, win}) => !hammer_le && !!win ? 1 : 0,
    [STAT_FIELDS.WITHOUT_HAMMER_LE_U1]: ({hammer_le, win}) => !hammer_le && !!win ? 1 : 0,
    [STAT_FIELDS.WITHOUT_HAMMER_LE_TIE]: ({hammer_le, win}) => !hammer_le && !!win ? 1 : 0,
    [STAT_FIELDS.WITHOUT_HAMMER_LE_D2]: ({hammer_le, win}) => !hammer_le && !!win ? 1 : 0,
    [STAT_FIELDS.WITHOUT_HAMMER_LE_D2]: ({hammer_le, win}) => !hammer_le && !!win ? 1 : 0,

    [STAT_FIELDS.WITH_HAMMER_2LE]: ({hammer_2le, win}) => !!hammer_2le && !!win ? 1 : 0,
    [STAT_FIELDS.WITH_HAMMER_2LE_U2]: ({hammer_2le, win}) => !!hammer_2le && !!win ? 1 : 0,
    [STAT_FIELDS.WITH_HAMMER_2LE_U1]: ({hammer_2le, win}) => !!hammer_2le && !!win ? 1 : 0,
    [STAT_FIELDS.WITH_HAMMER_2LE_TIE]: ({hammer_2le, win}) => !!hammer_2le && !!win ? 1 : 0,
    [STAT_FIELDS.WITH_HAMMER_2LE_D2]: ({hammer_2le, win}) => !!hammer_2le && !!win ? 1 : 0,
    [STAT_FIELDS.WITH_HAMMER_2LE_D2]: ({hammer_2le, win}) => !!hammer_2le && !!win ? 1 : 0,
   
}

export const NON_PERCENT_STATS = [STAT_TYPES.POINTS_FOR_PER_GAME, STAT_TYPES.POINTS_AGAINST_PER_GAME, STAT_TYPES.ENDS_FOR_PER_GAME, STAT_TYPES.ENDS_AGAINST_PER_GAME, STAT_TYPES.POINTS_PER_END];



export const STAT_FIELD_FILTER_FUNCTIONS = {
    [STAT_FIELDS.YELLOW]: ({ color }) => color === "yellow",
    [STAT_FIELDS.BLUE]: ({ color }) => color === "blue",
    [STAT_FIELDS.RED]: ({ color }) => color === "red",
    [STAT_FIELDS.WITH_HAMMER_FE]: ({ hammer_first_end_count }) => !!hammer_first_end_count,
    [STAT_FIELDS.WITHOUT_HAMMER_FE]:({ hammer_first_end_count }) => !hammer_first_end_count,
   

    [STAT_FIELDS.WITH_HAMMER]: () => true,
    [STAT_FIELDS.WITHOUT_HAMMER]: () => true,

    [STAT_FIELDS.WITH_HAMMER_EE]: ({hammer_ee, ee}) => !!ee && !!hammer_ee,
    [STAT_FIELDS.WITHOUT_HAMMER_EE]: ({hammer_ee, ee}) => !!ee && !hammer_ee,

    [STAT_FIELDS.WITH_HAMMER_LE]: ({ hammer_le, early_end }) => !early_end && !!hammer_le,
    [STAT_FIELDS.WITH_HAMMER_LE_TIE]: ({hammer_le, diff_le, early_end}) => !early_end && !!hammer_le  && diff_le === 0,
    [STAT_FIELDS.WITH_HAMMER_LE_U1]: ({hammer_le, diff_le, early_end}) => !early_end && !!hammer_le  && diff_le === 1,
    [STAT_FIELDS.WITH_HAMMER_LE_U2]: ({hammer_le, diff_le, early_end}) => !early_end && !!hammer_le  && diff_le > 1,
    [STAT_FIELDS.WITH_HAMMER_LE_D1]: ({hammer_le, diff_le, early_end}) => !early_end && !!hammer_le  && diff_le === -1,
    [STAT_FIELDS.WITH_HAMMER_LE_D2]: ({hammer_le, diff_le, early_end}) => !early_end && !!hammer_le  && diff_le < -1,

    [STAT_FIELDS.WITHOUT_HAMMER_LE]: ({ hammer_le, early_end }) => !early_end && !hammer_le,
    [STAT_FIELDS.WITHOUT_HAMMER_LE_TIE]: ({hammer_le, diff_le, early_end}) => !early_end && !hammer_le  && diff_le === 0,
    [STAT_FIELDS.WITHOUT_HAMMER_LE_U1]: ({hammer_le, diff_le, early_end}) => !early_end && !hammer_le  && diff_le === 1,
    [STAT_FIELDS.WITHOUT_HAMMER_LE_U2]: ({hammer_le, diff_le, early_end}) => !early_end && !hammer_le  && diff_le > 1,
    [STAT_FIELDS.WITHOUT_HAMMER_LE_D1]: ({hammer_le, diff_le, early_end}) => !early_end && !hammer_le  && diff_le === -1,
    [STAT_FIELDS.WITHOUT_HAMMER_LE_D2]: ({hammer_le, diff_le, early_end}) => !early_end && !hammer_le  && diff_le < -1,

    [STAT_FIELDS.WITH_HAMMER_2LE]: ({ hammer_2le, early_end }) => !early_end && !!hammer_2le,
    [STAT_FIELDS.WITH_HAMMER_2LE_TIE]: ({hammer_2le, diff_2le, early_end}) => !early_end && !!hammer_2le  && diff_2le === 0,
    [STAT_FIELDS.WITH_HAMMER_2LE_U1]: ({hammer_2le, diff_2le, early_end}) => !early_end && !!hammer_2le  && diff_2le === 1,
    [STAT_FIELDS.WITH_HAMMER_2LE_U2]: ({hammer_2le, diff_2le, early_end}) => !early_end && !!hammer_2le  && diff_2le > 1,
    [STAT_FIELDS.WITH_HAMMER_2LE_D1]: ({hammer_2le, diff_2le, early_end}) => !early_end && !!hammer_2le  && diff_2le === -1,
    [STAT_FIELDS.WITH_HAMMER_2LE_D2]: ({hammer_2le, diff_2le, early_end}) => !early_end && !!hammer_2le  && diff_2le < -1,

    [STAT_FIELDS.WITHOUT_HAMMER_2LE]: ({ hammer_2le, early_end }) => !early_end && !hammer_2le,
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_TIE]: ({hammer_2le, diff_2le, early_end}) => !early_end && !hammer_2le  && diff_2le === 0,
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_U1]: ({hammer_2le, diff_2le, early_end}) => !early_end && !hammer_2le  && diff_2le === 1,
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_U2]: ({hammer_2le, diff_2le, early_end}) => !early_end && !hammer_2le  && diff_2le > 1,
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_D1]: ({hammer_2le, diff_2le, early_end}) => !early_end && !hammer_2le  && diff_2le === -1,
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_D2]: ({hammer_2le, diff_2le, early_end}) => !early_end && !hammer_2le  && diff_2le < -1,

    [STAT_FIELDS.WITH_HAMMER_3LE]: ({ hammer_3le, early_end }) => !early_end && !!hammer_3le,
    [STAT_FIELDS.WITH_HAMMER_3LE_TIE]: ({hammer_3le, diff_3le, early_end}) => !early_end && !!hammer_3le  && diff_3le === 0,
    [STAT_FIELDS.WITH_HAMMER_3LE_U1]: ({hammer_3le, diff_3le, early_end}) => !early_end && !!hammer_3le  && diff_3le === 1,
    [STAT_FIELDS.WITH_HAMMER_3LE_U2]: ({hammer_3le, diff_3le, early_end}) => !early_end && !!hammer_3le  && diff_3le > 1,
    [STAT_FIELDS.WITH_HAMMER_3LE_D1]: ({hammer_3le, diff_3le, early_end}) => !early_end && !!hammer_3le  && diff_3le === -1,
    [STAT_FIELDS.WITH_HAMMER_3LE_D2]: ({hammer_3le, diff_3le, early_end}) => !early_end && !!hammer_3le  && diff_3le < -1,

    [STAT_FIELDS.WITHOUT_HAMMER_3LE]: ({ hammer_3le, early_end }) => !early_end && !hammer_3le,
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_TIE]: ({hammer_3le, diff_3le, early_end}) => !early_end && !hammer_3le  && diff_3le === 0,
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_U1]: ({hammer_3le, diff_3le, early_end}) => !early_end && !hammer_3le  && diff_3le === 1,
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_U2]: ({hammer_3le, diff_3le, early_end}) => !early_end && !hammer_3le  && diff_3le > 1,
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_D1]: ({hammer_3le, diff_3le, early_end}) => !early_end && !hammer_3le  && diff_3le === -1,
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_D2]: ({hammer_3le, diff_3le, early_end}) => !early_end && !hammer_3le  && diff_3le < -1,
};

export const STAT_FIELD_TITLES = {
    [STAT_FIELDS.BLUE]: () => 'Blue rocks',
    [STAT_FIELDS.YELLOW]: () => 'Yellow rocks',
    [STAT_FIELDS.RED]: () => 'Red rocks',
    [STAT_FIELDS.WITH_HAMMER_FE]: () => 'With HFE',
    [STAT_FIELDS.WITHOUT_HAMMER_FE]: () => 'Without HFE',
    [STAT_FIELDS.WITH_HAMMER]: (type) => type === STAT_TYPES.HAMMER_EFFICIENCY ? 'Average points scored' : 'With hammer',
    [STAT_FIELDS.WITHOUT_HAMMER]: () => 'Without hammer',

    [STAT_FIELDS.WITH_HAMMER_EE]: () => 'With hammer',
    [STAT_FIELDS.WITHOUT_HAMMER_EE]: () => 'Without hammer',

    [STAT_FIELDS.WITH_HAMMER_LE]: () => 'With hammer',
    [STAT_FIELDS.WITH_HAMMER_LE_TIE]: () => 'Tied',
    [STAT_FIELDS.WITH_HAMMER_LE_U1]: () => 'Up 1',
    [STAT_FIELDS.WITH_HAMMER_LE_U2]: () => 'Up by 2+',
    [STAT_FIELDS.WITH_HAMMER_LE_D1]: () => 'Down 1',
    [STAT_FIELDS.WITH_HAMMER_LE_D2]: () => 'Down 2+',

    [STAT_FIELDS.WITHOUT_HAMMER_LE]: () => 'Without hammer',
    [STAT_FIELDS.WITHOUT_HAMMER_LE_TIE]: () => 'Tied',
    [STAT_FIELDS.WITHOUT_HAMMER_LE_U1]: () => 'Up 1',
    [STAT_FIELDS.WITHOUT_HAMMER_LE_U2]: () => 'Up by 2+',
    [STAT_FIELDS.WITHOUT_HAMMER_LE_D1]: () => 'Down 1',
    [STAT_FIELDS.WITHOUT_HAMMER_LE_D2]: () => 'Down 2+',

    [STAT_FIELDS.WITH_HAMMER_2LE]: () => 'With hammer',
    [STAT_FIELDS.WITH_HAMMER_2LE_TIE]: () => 'Tied',
    [STAT_FIELDS.WITH_HAMMER_2LE_U1]: () => 'Up 1',
    [STAT_FIELDS.WITH_HAMMER_2LE_U2]: () => 'Up by 2+',
    [STAT_FIELDS.WITH_HAMMER_2LE_D1]: () => 'Down 1',
    [STAT_FIELDS.WITH_HAMMER_2LE_D2]: () => 'Down 2+',

    [STAT_FIELDS.WITHOUT_HAMMER_2LE]: () => 'Without hammer',
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_TIE]: () => 'Tied',
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_U1]: () => 'Up 1',
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_U2]: () => 'Up by 2+',
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_D1]: () => 'Down 1',
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_D2]: () => 'Down 2+',

    [STAT_FIELDS.WITH_HAMMER_3LE]: () => 'With hammer',
    [STAT_FIELDS.WITH_HAMMER_3LE_TIE]: () => 'Tied',
    [STAT_FIELDS.WITH_HAMMER_3LE_U1]: () => 'Up 1',
    [STAT_FIELDS.WITH_HAMMER_3LE_U2]: () => 'Up by 2+',
    [STAT_FIELDS.WITH_HAMMER_3LE_D1]: () => 'Down 1',
    [STAT_FIELDS.WITH_HAMMER_3LE_D2]: () => 'Down 2+',

    [STAT_FIELDS.WITHOUT_HAMMER_3LE]: () => 'Without hammer',
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_TIE]: () => 'Tied',
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_U1]: () => 'Up 1',
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_U2]: () => 'Up by 2+',
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_D1]: () => 'Down 1',
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_D2]: () => 'Down 2+',
}

export const STAT_TYPE_SUBTITLES = {
    [STAT_FIELDS.WITH_HAMMER_LE]: (stats) => {
        const filtered = stats.filter(({early_end}) => !early_end);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {hammer_le}) => {
            return all + hammer_le
        }, 0)
        return `${sum}/${length} games`
        // return `${sum}/${length} games (${((sum / length) * 100).toFixed(1)}%)`
    },
    [STAT_FIELDS.WITH_HAMMER_LE_U2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_le}) => !early_end && !!hammer_le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_le}) => {
            return all + (diff_le > 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_LE_U1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_le}) => !early_end && !!hammer_le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_le}) => {
            return all + (diff_le === 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_LE_TIE]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_le}) => !early_end && !!hammer_le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_le}) => {
            return all + (diff_le === 0 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_LE_D1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_le}) => !early_end && !!hammer_le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_le}) => {
            return all + (diff_le === -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_LE_D2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_le}) => !early_end && !!hammer_le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_le}) => {
            return all + (diff_le < -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_LE]: (stats) => {
        const filtered = stats.filter(({early_end}) => !early_end);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {hammer_le}) => {
            return all + (!hammer_le ? 1 : 0)
        }, 0)
        return `${sum}/${length} games`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_LE_U2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_le}) => !early_end && !hammer_le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_le}) => {
            return all + (diff_le > 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_LE_U1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_le}) => !early_end && !hammer_le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_le}) => {
            return all + (diff_le === 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_LE_TIE]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_le}) => !early_end && !hammer_le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_le}) => {
            return all + (diff_le === 0 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_LE_D1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_le}) => !early_end && !hammer_le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_le}) => {
            return all + (diff_le === -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_LE_D2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_le}) => !early_end && !hammer_le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_le}) => {
            return all + (diff_le < -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_EE]: (stats) => {
        const filtered = stats.filter(({ee}) => !!ee);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {hammer_ee}) => {
            return all + hammer_ee
        }, 0)
        return `${sum}/${length} games`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_EE]: (stats) => {
        const filtered = stats.filter(({ee}) => !!ee);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {hammer_ee}) => {
            return all + (!hammer_ee ? 1 : 0)
        }, 0)
        return `${sum}/${length} games`
    },
    [STAT_FIELDS.WITH_HAMMER_2LE]: (stats) => {
        const filtered = stats.filter(({early_end}) => !early_end);
        const length = filtered.length;
        const sum = filtered.reduce((all, {hammer_2le}) => {
            return all + hammer_2le
        }, 0)
        return `${sum}/${length} games`
    },
    [STAT_FIELDS.WITH_HAMMER_2LE_U2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_2le}) => !early_end && !!hammer_2le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_2le}) => {
            return all + (diff_2le > 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_2LE_U1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_2le}) => !early_end && !!hammer_2le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_2le}) => {
            return all + (diff_2le === 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_2LE_TIE]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_2le}) => !early_end && !!hammer_2le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_2le}) => {
            return all + (diff_2le === 0 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_2LE_D1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_2le}) => !early_end && !!hammer_2le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_2le}) => {
            return all + (diff_2le === -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_2LE_D2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_2le}) => !early_end && !!hammer_2le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_2le}) => {
            return all + (diff_2le < -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_2LE]: (stats) => {
        const filtered = stats.filter(({early_end}) => !early_end);
        const length = filtered.length;
        const sum = filtered.reduce((all, {hammer_2le}) => {
            return all + (!hammer_2le ? 1 : 0)
        }, 0)
        return `${sum}/${length} games`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_U2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_2le}) => !early_end && !hammer_2le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_2le}) => {
            return all + (diff_2le > 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_U1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_2le}) => !early_end && !hammer_2le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_2le}) => {
            return all + (diff_2le === 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_TIE]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_2le}) => !early_end && !hammer_2le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_2le}) => {
            return all + (diff_2le === 0 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_D1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_2le}) => !early_end && !hammer_2le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_2le}) => {
            return all + (diff_2le === -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_D2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_2le}) => !early_end && !hammer_2le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_2le}) => {
            return all + (diff_2le < -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },

    [STAT_FIELDS.WITH_HAMMER_3LE]: (stats) => {
        const filtered = stats.filter(({early_end}) => !early_end);
        const length = filtered.length;
        const sum = filtered.reduce((all, {hammer_3le}) => {
            return all + hammer_3le
        }, 0)
        return `${sum}/${length} games`
    },
    [STAT_FIELDS.WITH_HAMMER_3LE_U2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_3le}) => !early_end && !!hammer_3le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_3le}) => {
            return all + (diff_3le > 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_3LE_U1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_3le}) => !early_end && !!hammer_3le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_3le}) => {
            return all + (diff_3le === 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_3LE_TIE]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_3le}) => !early_end && !!hammer_3le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_3le}) => {
            return all + (diff_3le === 0 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_3LE_D1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_3le}) => !early_end && !!hammer_3le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_3le}) => {
            return all + (diff_3le === -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITH_HAMMER_3LE_D2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_3le}) => !early_end && !!hammer_3le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_3le}) => {
            return all + (diff_3le < -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_3LE]: (stats) => {
        const filtered = stats.filter(({early_end}) => !early_end);
        const length = filtered.length;
        const sum = filtered.reduce((all, {hammer_3le}) => {
            return all + (!hammer_3le ? 1 : 0)
        }, 0)
        return `${sum}/${length} games`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_U2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_3le}) => !early_end && !hammer_3le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_3le}) => {
            return all + (diff_3le > 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_U1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_3le}) => !early_end && !hammer_3le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_3le}) => {
            return all + (diff_3le === 1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_TIE]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_3le}) => !early_end && !hammer_3le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_3le}) => {
            return all + (diff_3le === 0 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_3LE_D1]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_3le}) => !early_end && !hammer_3le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_3le}) => {
            return all + (diff_3le === -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
    [STAT_FIELDS.WITHOUT_HAMMER_2LE_D2]: (stats) => {
        const filtered = stats.filter(({early_end, hammer_2le}) => !early_end && !hammer_2le);
        const length = filtered?.length;
        const sum = filtered.reduce((all, {diff_2le}) => {
            return all + (diff_2le < -1 ? 1 : 0)
        }, 0)
        return `(${sum}/${length})`
    },
}
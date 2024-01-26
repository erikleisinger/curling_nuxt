import { INVERTED_STATS, NON_PERCENT_STATS, STAT_CALCULATION_PARAMS, STAT_TYPES, STAT_FIELD_FILTER_FUNCTIONS, STAT_FIELDS, STAT_FIELDS_TOTAL } from "@/constants/stats";
import { defaultFieldCalculator } from "@/utils/stats/defaultFieldCalculator";
import { getCumulativeStat } from "@/utils/stats/getCumulativeStat";

const toPercent = (num) => {
    return (num * 100).toFixed();
};

const isPercentStat = (type, field) => {
    if (field === STAT_FIELDS.WITH_HAMMER && type === STAT_TYPES.HAMMER_EFFICIENCY) return false;
    return !NON_PERCENT_STATS.includes(type)
}

const cleanStatValue = (num, type, fallback = '-', field) => {
    if (Number.isNaN(num)) return fallback;
    const isPercent = isPercentStat(type, field)
   
    return (num * (isPercent ? 100 : 1)).toFixed(isPercent ? 0 : 1);
};



const getHighestLowest = (statType, stats, average) => {
    const isInverted = INVERTED_STATS.includes(statType);
    const isPercent = !NON_PERCENT_STATS.includes(statType)

    const calced = [...stats].map(STAT_FIELDS_TOTAL[statType]);
    const highestIndex = isInverted
        ? calced.indexOf(Math.min(...calced))
        : calced.indexOf(Math.max(...calced));
    const lowestIndex = isInverted
        ? calced.indexOf(Math.max(...calced))
        : calced.indexOf(Math.min(...calced));
    const highest = isInverted ? calced[lowestIndex] : calced[highestIndex];
    const lowest = isInverted ? calced[highestIndex] : calced[lowestIndex];
    const highestDiff = highest * (isPercent ? 100 : 1) - average;
    const lowestDiff = lowest * (isPercent ? 100 : 1) - average;
    const highestGame = stats[highestIndex];
    const lowestGame = stats[lowestIndex];
    return {
        highest,
        lowest,
        highestIndex,
        lowestIndex,
        highestDiff,
        lowestDiff,
        highestGame,
        lowestGame,
    };
};

export {
    cleanStatValue,
    defaultFieldCalculator, 
    getCumulativeStat,
    getHighestLowest,
    isPercentStat
};
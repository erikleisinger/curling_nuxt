import { STAT_FIELD_FILTER_FUNCTIONS, STAT_CALCULATION_PARAMS, STAT_TYPES } from "@/constants/stats";
export const getCumulativeStat = (statsArray, type, field) => { 
    const filterFunc = STAT_FIELD_FILTER_FUNCTIONS[field];
    let stats;
    if (filterFunc) {
        stats = [...statsArray].filter(filterFunc)
    } else {
        stats = statsArray;
    }
    const {numerator, denominator} = STAT_CALCULATION_PARAMS[type]
    const cumulative = stats.reduce((all, current) => {
        const thisNumerator = numerator(current);
        const thisDenominator = denominator(current)
        return {
            numerator: all.numerator + (Number.isNaN(thisNumerator) ? 0 : thisNumerator),
            denominator: all.denominator + (Number.isNaN(thisDenominator) ? 0 : thisDenominator),

        }
    }, {
        numerator: 0,
        denominator: 0,
    })
    const total = cumulative.numerator / cumulative.denominator
    const returnTotal = Number.isNaN(total) ? 0 : total;
    return type === STAT_TYPES.STEAL_DEFENSE ? 1 - returnTotal : returnTotal
  
    
}
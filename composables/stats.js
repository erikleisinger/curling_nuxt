import { STAT_TYPES, CUMULATIVE_CHART_STATS, NON_PERCENT_STATS, STAT_FIELDS_TOTAL } from "@/constants/stats";
import {isPercentStat, cleanStatValue, getCumulativeStat} from '@/utils/stats'
export const useStats = () => {
    const calcHammerEfficiency = ({hammer_conversion_count, hammer_blank_count, hammer_end_count}) => {
        return hammer_conversion_count / (hammer_end_count - hammer_blank_count)
    }
    const calcStealEfficiency = ({non_hammer_steal_count, non_hammer_end_count}) => {
        return non_hammer_steal_count / non_hammer_end_count
    }
    const calcForceEfficiency = ({non_hammer_force_count, non_hammer_end_count}) => {
        return non_hammer_force_count / non_hammer_end_count
    }

    const calcStealDefense = ({hammer_steal_count, hammer_end_count}) => {
        return 1 - (hammer_steal_count / hammer_end_count)
    }

    const calcBlanks = ({hammer_blank_count, hammer_end_count}) => {
        return hammer_blank_count / hammer_end_count;
    }

    const getStatCalculator = (statName) => {
        return {
            [STAT_TYPES.HAMMER_EFFICIENCY]: calcHammerEfficiency,
            [STAT_TYPES.STEAL_EFFICIENCY]: calcStealEfficiency,
            [STAT_TYPES.FORCE_EFFICIENCY]: calcForceEfficiency,
            [STAT_TYPES.STEAL_DEFENSE]: calcStealDefense,
            [STAT_TYPES.BLANK_ENDS]: calcBlanks,

        }[statName]
    }

    // const filterStats = (stats, filter) => {
    //     if (Array.isArray(stats)) return stats.filter(filter)
    // }

    const calcStat = (allStats, type, filter) => {
        const stats = filter ? filter(allStats) : allStats;
        if (!Object.values(STAT_TYPES).includes(type)) {
            console.error(`stat types doesnt include ${type}`)
            return 0;
        }
        const func = getStatCalculator(type);
        if (!func) {
            console.error(`no stat calculator for ${type}`)
            return 0;
        }

        let total = 0;
        if (Array.isArray(stats)) {
            const cumulative = stats.reduce((all, current) => {
                return all + func(current)
            }, 0)
            total = cumulative / stats.length;
        } else {
           total = func(stats);
        }
        if (Number.isNaN(total)) return 0;

        return total * 100;
    }



    const getCumulativeHighestLowest = (statsArray, type) => {
        let lowest = 0;
        let highest = 0;
        let highestIndex = 0;
        let lowestIndex = 0;

        statsArray.forEach((stat, index) => {
            const array = [...statsArray].splice(0, index + 1)
            const value = getCumulativeStat(array, type);
            if (!index) {
                lowest = value;
                highest = value;
            } else {
                if (value > highest) {
                    highest = value;
                }
                if (value < lowest) {
                    lowest = value;
                }
            }
        })

        return {
            highest, 
            lowest,
            lowestIndex,
            highestIndex,
        }

    }

    const getChartPoints = (stats, type, cumulative, isPercent) => {
        // const isCumulative = CUMULATIVE_CHART_STATS.includes(type);
        const isThisStatPercent = !NON_PERCENT_STATS.includes(type)
        const points = stats.map((data, index) => {
            if (cumulative) {
                return (
                    getCumulativeStat(
                        stats.slice(0, index + 1),
                        type
                    ) * (!isThisStatPercent ? 1 : isPercent ? 100 : 1)
                );
            }
    
            return STAT_FIELDS_TOTAL[type](data) * (!isThisStatPercent ? 1 : isPercent ? 100 : 1);
        });
        if (points.length === 1) return [points[0], points[0]]
        return points;
    };



    return { calcStat, getCumulativeStat, getCumulativeHighestLowest, getChartPoints, isPercentStat, cleanStatValue };
};

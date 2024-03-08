import { STAT_TYPES, CUMULATIVE_CHART_STATS, NON_PERCENT_STATS, STAT_FIELDS_TOTAL } from "@/constants/stats";
import {isPercentStat, cleanStatValue, getCumulativeStat, getHighestLowest} from '@/utils/stats/index'
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



    return { getCumulativeStat, getCumulativeHighestLowest, getChartPoints, isPercentStat, cleanStatValue, getHighestLowest };
};

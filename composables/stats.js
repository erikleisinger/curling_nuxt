import { STAT_TYPES } from "@/constants/stats";
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

    const calcStat = (stats, type) => {
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

    return { calcStat };
};

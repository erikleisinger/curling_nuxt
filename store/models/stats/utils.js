export const formatPercent = (value, decimals = 0) => {
    return Number.isNaN(value) ? '-' : Number((value * 100).toFixed(decimals));
}

export const calcWins = (stats, decimals = 0) => {
    const gamesPlayed = stats?.length;
        const wins = stats.filter(({win}) => !!win);
        const total = wins?.length / gamesPlayed
        return formatPercent(total, decimals)
}

export const calcHammerEfficiency = (stats) => {    
    const cumulative = stats.reduce((all, current) => {
        all.hammer_end_count += current.hammer_end_count ?? 0
        all.hammer_conversion_count += current.hammer_conversion_count ?? 0
        all.hammer_blank_count += current.hammer_blank_count ?? 0
        return all
    }, {
        hammer_end_count: 0,
        hammer_conversion_count: 0,
        hammer_blank_count: 0
    })
    const {
        hammer_end_count,
        hammer_conversion_count,
        hammer_blank_count
    } = cumulative
    const total = hammer_conversion_count / (hammer_end_count - hammer_blank_count)
    return Number.isNaN(total) ? '-' : Number((total * 100).toFixed());
}

export const calcStealEfficiency = (stats) => {
    const cumulative = stats.reduce((all, current) => {
        all.non_hammer_end_count += current.non_hammer_end_count ?? 0
        all.non_hammer_steal_count += current.non_hammer_steal_count ?? 0
        return all
    }, {
        non_hammer_end_count: 0,
        non_hammer_steal_count: 0,
    })
    const {
        non_hammer_end_count,
        non_hammer_steal_count,
    } = cumulative
    const total = non_hammer_steal_count / non_hammer_end_count
    return Number.isNaN(total) ? '-' : Number((total * 100).toFixed());
}

export const calcForceEfficiency = (stats) => {
    const cumulative = stats.reduce((all, current) => {
        all.non_hammer_end_count += current.non_hammer_end_count ?? 0
        all.non_hammer_force_count += current.non_hammer_force_count ?? 0
        return all
    }, {
        non_hammer_end_count: 0,
        non_hammer_force_count: 0,
    })
    const {
        non_hammer_end_count,
        non_hammer_force_count,
    } = cumulative
    const total = non_hammer_force_count / non_hammer_end_count
    return Number.isNaN(total) ? '-' : Number((total * 100).toFixed());
}

export const calcStealDefense = (stats) => {
    const cumulative = stats.reduce((all, current) => {
        all.hammer_end_count += current.hammer_end_count ?? 0
        all.hammer_steal_count += current.hammer_steal_count ?? 0
        return all
    }, {
        hammer_end_count: 0,
        hammer_steal_count: 0,
    })
    const {
        hammer_end_count,
        hammer_steal_count,
    } = cumulative
    const total = hammer_steal_count / hammer_end_count
    return Number.isNaN(total) ? '-' : Number(((1 - total) * 100).toFixed());
}

export const getChartPoints = (stats, type, cumulative, isPercent) => {
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
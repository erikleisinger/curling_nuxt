import {calcStealDefense, sortByStartTime, cleanNumber} from '@/store/models/stats/utils'
import {getColor} from '@/business/utils/color'
import {STAT_COLORS, STAT_NAMES, STAT_TYPES} from '@/presentation/constants/stats'

export class StealDefense {
    constructor(stats) {
        this.stats = stats;
        this.isPercent = true;
    }

    get percent() {
        return calcStealDefense(this.stats)
    }

    get seasonHigh () {
        return Math.max(...this.stats.map((stat) => calcStealDefense([stat])))
    }

    get seasonLow() {
        return Math.min(...this.stats.map((stat) => calcStealDefense([stat])))
    }

    get winAverage () {
        const ordered = this.stats.filter(({win, tie}) => !!win && !tie).map((stat) => calcStealDefense([stat])).sort((a,b) => a-b);
       const median = ordered.length % 2 === 0 ? (ordered[ordered.length / 2] + ordered[ordered.length / 2 - 1]) / 2 : ordered[Math.floor(ordered.length / 2)];
       return cleanNumber(median);
    }

    get lossAverage() {
        const ordered = this.stats.filter(({win, tie}) => !win && !tie).map((stat) => calcStealDefense([stat])).sort((a,b) => a-b);
        const median = ordered.length % 2 === 0 ? (ordered[ordered.length / 2] + ordered[ordered.length / 2 - 1]) / 2 : ordered[Math.floor(ordered.length / 2)];
        return cleanNumber(median);
    }

    chartPoints(cumulative = false) {
        let allStats = []
        if (cumulative) {
            allStats = this.stats.reduce((all, current, index) => {
                return [...all, calcStealDefense([...this.stats.slice(0, index), current])]
            }, [])
        } else {
            allStats = this.stats.map((stat) => calcStealDefense([stat]))
        }
        return {
            points: allStats.sort(sortByStartTime),
            color: getColor(STAT_COLORS[STAT_TYPES.STEAL_DEFENSE]),
            label: STAT_NAMES[STAT_TYPES.STEAL_DEFENSE]
        }
        
    }
}


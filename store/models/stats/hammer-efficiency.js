import {calcHammerEfficiency, sortByStartTime, cleanNumber} from '@/store/models/stats/utils'
import {getColor} from '@/utils/color'
import {STAT_COLORS, STAT_NAMES, STAT_TYPES} from '@/constants/stats'

export class HammerEfficiency {
    constructor(stats) {
        this.stats = stats;
        this.isPercent = true;
    }

    get percent() {
        return calcHammerEfficiency(this.stats)
    }

    get seasonHigh () {
        return Math.max(...this.stats.map((stat) => calcHammerEfficiency([stat])))
    }

    get seasonLow() {
        return Math.min(...this.stats.map((stat) => calcHammerEfficiency([stat])))
    }

    get winAverage () {
        const ordered = this.stats.filter(({win, tie}) => !!win && !tie).map((stat) => calcHammerEfficiency([stat])).sort((a,b) => a-b);
        const median = ordered.length % 2 === 0 ? (ordered[ordered.length / 2] + ordered[ordered.length / 2 - 1]) / 2 : ordered[Math.floor(ordered.length / 2)];
        return cleanNumber(median);
     }
 
     get lossAverage () {
         const ordered = this.stats.filter(({win, tie}) => !win && !tie).map((stat) => calcHammerEfficiency([stat])).sort((a,b) => a-b);
         const median = ordered.length % 2 === 0 ? (ordered[ordered.length / 2] + ordered[ordered.length / 2 - 1]) / 2 : ordered[Math.floor(ordered.length / 2)];
         return cleanNumber(median);
     }

    chartPoints(cumulative = false) {
        let allStats = []
        if (cumulative) {
            allStats = this.stats.reduce((all, current, index) => {
                return [...all, calcHammerEfficiency([...this.stats.slice(0, index), current])]
            }, [])
        } else {
            allStats = this.stats.map((stat) => calcHammerEfficiency([stat]))
        }
        return {
            points: allStats.sort(sortByStartTime),
            color: getColor(STAT_COLORS[STAT_TYPES.HAMMER_EFFICIENCY]),
            label: STAT_NAMES[STAT_TYPES.HAMMER_EFFICIENCY]
        }
        
    }
}


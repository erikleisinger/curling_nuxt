import {calcHammerEfficiency, sortByStartTime} from '@/store/models/stats/utils'
import {getColor} from '@/utils/color'
import {STAT_COLORS, STAT_NAMES, STAT_TYPES} from '@/constants/stats'

export class HammerEfficiency {
    constructor(stats) {
        this.stats = stats
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


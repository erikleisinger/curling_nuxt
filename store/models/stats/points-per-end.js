import {calcPointsPerEnd, calcPointsWithHammer, calcPointsWithoutHammer} from '@/store/models/stats/utils'
import {getColor} from '@/business/utils/color'
import {STAT_COLORS, STAT_NAMES, STAT_TYPES} from '@/presentation/constants/stats'

export class PointsPerEnd {
    constructor(stats) {
        this.stats = stats;
        this.isPercent = false;

    }

    get percent() {
        return calcPointsPerEnd(this.stats)
    }

    get withHammer() {
        
        return calcPointsWithHammer(this.stats)
    }

    get withoutHammer() {
        return calcPointsWithoutHammer(this.stats)
    }


    get seasonHigh () {
        return Math.max(...this.stats.map((stat) => calcPointsPerEnd([stat])))
    }

    get seasonLow() {
        return Math.min(...this.stats.map((stat) => calcPointsPerEnd([stat])))
    }

    chartPoints(cumulative = false) {
        let allStats = []
        if (cumulative) {
            allStats = this.stats.reduce((all, current, index) => {
                return [...all, calcPointsPerEnd([...this.stats.slice(0, index), current])]
            }, [])
        } else {
            allStats = this.stats.map((stat) => calcPointsPerEnd([stat]))
        }
        return {
            points: allStats,
            color: getColor(STAT_COLORS[STAT_TYPES.POINTS_PER_END]),
            label: STAT_NAMES[STAT_TYPES.POINTS_PER_END]
        }
        
    }
}


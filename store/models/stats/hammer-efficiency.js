import {calcHammerEfficiency} from '@/store/models/stats/utils'
import {getColor} from '@/utils/color'
import {STAT_COLORS, STAT_NAMES, STAT_TYPES} from '@/constants/stats'

export class HammerEfficiency {
    constructor(stats, sort = true) {
        this.stats = stats.sort((a,b) => {
            if (!sort) return 1;
            return a.start_time - b.start_time
        });
    }

    get percent() {
        return calcHammerEfficiency(this.stats)
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
            points: allStats,
            color: getColor(STAT_COLORS[STAT_TYPES.HAMMER_EFFICIENCY]),
            label: STAT_NAMES[STAT_TYPES.HAMMER_EFFICIENCY]
        }
        
    }
}


import {calcWins, calcHammerEfficiency, calcStealEfficiency,  formatPercent, cleanNumber, sortByStartTime} from '@/store/models/stats/utils'
import {getColor} from '@/utils/color'
import {STAT_COLORS, STAT_NAMES, STAT_TYPES} from '@/constants/stats'

export class Wins {
    constructor(stats, filterFunc = () => true) {
    
        this.stats = stats.filter(filterFunc);
        this.yellowGames = stats.filter(({color}) => color === 'yellow');
        this.blueGames = stats.filter(({color}) => color === 'blue');
        this.redGames = stats.filter(({color}) => color === 'red')
       
    }

    get percent() {
        return calcWins(this.stats)
    }

    get yellow() {
        return calcWins(this.yellowGames);
    }

    get red() {
        return calcWins(this.redGames);
    }

    get blue() {
        return calcWins(this.blueGames);
    }

    get yellowGameCount() {
        return this.yellowGames.length;
    }

    get redGameCount() {
        return this.redGames.length;
    }

    get blueGameCount() {
        return this.blueGames.length;
    }

    /**
     * hammer efficiency
     */

    get hammerEfficiency () {
       const ordered = this.stats.filter(({win, tie}) => !!win && !tie).map((stat) => calcHammerEfficiency([stat])).sort((a,b) => a-b);
       const median = ordered.length % 2 === 0 ? (ordered[ordered.length / 2] + ordered[ordered.length / 2 - 1]) / 2 : ordered[Math.floor(ordered.length / 2)];
       return cleanNumber(median);
    }

    get lossHammerEfficiency () {
        const ordered = this.stats.filter(({win, tie}) => !win && !tie).map((stat) => calcHammerEfficiency([stat])).sort((a,b) => a-b);
        const median = ordered.length % 2 === 0 ? (ordered[ordered.length / 2] + ordered[ordered.length / 2 - 1]) / 2 : ordered[Math.floor(ordered.length / 2)];
        return cleanNumber(median);
    }

    get lowestWinningHammerEfficiency () {
        let lowest = 100;
        this.stats.forEach((stat) => {
            if (!stat.win) return;
            const he = calcHammerEfficiency([stat]);
            if (he < lowest) {
                lowest = he;
            }
        })
       
        return formatPercent(lowest);
    }

    get highestLosingHammerEfficiency () {
        let highest = 0
        this.stats.forEach((stat) => {
            if (!!stat.win) return;
            const he = calcHammerEfficiency([stat]);
            if (he > highest) highest = he;
        })
        return formatPercent(highest);
    }



    /**
     * steal efficiency
     */

    get stealEfficiency () {
        const ordered = this.stats.filter(({win, tie}) => !!win && !tie).map((stat) => calcStealEfficiency([stat])).sort((a,b) => a-b);
       const median = ordered.length % 2 === 0 ? (ordered[ordered.length / 2] + ordered[ordered.length / 2 - 1]) / 2 : ordered[Math.floor(ordered.length / 2)];
       return cleanNumber(median);
    }

    get lossStealEfficiency() {
        const ordered = this.stats.filter(({win, tie}) => !win && !tie).map((stat) => calcStealEfficiency([stat])).sort((a,b) => a-b);
        const median = ordered.length % 2 === 0 ? (ordered[ordered.length / 2] + ordered[ordered.length / 2 - 1]) / 2 : ordered[Math.floor(ordered.length / 2)];
        return cleanNumber(median);
    }

    byEnd ({
        /**
         * How many ends remaining?
         * 2 = third last last end
         * 1 = second last end
         * 0 = last end
         * -1 = extra end
         */
        endsRemaining,
        /**
         * What was the difference in score?
         * 2 = up by 2 OR MORE
         * 1 = up 1
         * 0 = tied
         * -1 = down by 1
         * -2 = down by 2 OR MORE
         */
        diff,
        /**
         * Did the team have hammer? 
         * boolean
         */
        hammer
    }) {
        const diffFilter = diff === 2 ? (endDiff) => endDiff >= 2 : diff === -2 ? (endDiff) => endDiff <= -2 : (endDiff) => endDiff === diff;
        const stats = this.stats.filter((stat) => {
            /**
             * If extra end, exclude games that did not go to an extra end.
             */
            if (endsRemaining === -1){
                if (!stat.ee) return false;
                if (hammer !== !!stat.hammer_ee) return false;
            } 
            if (endsRemaining === 0) {
                if (hammer !== !!stat.hammer_le) return false;
                if (diff !== undefined) return diffFilter(stat.diff_le);
            }
            if (endsRemaining === 1) {
                if (hammer !== !!stat.hammer_2le) return false;
                if (diff !== undefined) return diffFilter(stat.diff_2le);
            }
            if (endsRemaining === 2) {
                if (hammer !== !!stat.hammer_3le) return false;
                if (diff !== undefined) return diffFilter(stat.diff_3le)
            }
            
            return true;

        })


        return {
            value: calcWins(stats),
            count: stats.length,
            totalCount: this.stats.length
        }
    }

    chartPoints(cumulative = true) {
        let allStats = []
        if (cumulative) {
            allStats = this.stats.reduce((all, current, index) => {
    
                return [...all, calcWins([...this.stats.slice(0, index), current], 2)]
            }, [])
        } else {
            allStats = this.stats.map((stat) => calcWins([stat], 2))
        }

        return {
            points: allStats.sort(sortByStartTime),
            color: getColor(STAT_COLORS[STAT_TYPES.WINS]),
            label: STAT_NAMES[STAT_TYPES.WINS]
        }
        
    }
}


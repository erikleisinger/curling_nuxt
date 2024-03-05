import {STAT_TYPES} from '@/constants/stats'
import {Wins} from '@/store/models/stats/wins'
import { HammerEfficiency } from '@/store/models/stats/hammer-efficiency';
import { PointsPerEnd } from '@/store/models/stats/points-per-end';
import { StealEfficiency } from '@/store/models/stats/steal-efficiency';
import { ForceEfficiency} from '@/store/models/stats/force-efficiency'
import { StealDefense} from '@/store/models/stats/steal-defense'
export class Stats {
    constructor(stats) {
        this.id = stats[0]?.team_id;
        this.gamesPlayed = stats?.length || 0;
        this[STAT_TYPES.WINS] = new Wins(stats)
        this[STAT_TYPES.HAMMER_EFFICIENCY] = new HammerEfficiency(stats)
        this[STAT_TYPES.POINTS_PER_END] = new PointsPerEnd(stats)
        this[STAT_TYPES.STEAL_EFFICIENCY] = new StealEfficiency(stats)
        this[STAT_TYPES.FORCE_EFFICIENCY] = new ForceEfficiency(stats)
        this[STAT_TYPES.STEAL_DEFENSE] = new StealDefense(stats);
      
 
    }

}


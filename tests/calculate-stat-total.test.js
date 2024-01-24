import {TEAM_STATS} from './__mock__/team-stats';
import { getCumulativeStat } from '../utils/stats';
import { STAT_TYPES, STAT_FIELDS_TOTAL, STAT_FIELDS } from '../constants/stats';
import { describe, expect, it, vi } from "vitest";

describe("it should output correct total stats for a team", () => {
    it('should output correct win total', () => {

        expect(getCumulativeStat([
            {
                win: 1
            },
            {
                win: 1,
            },
            {
                win: 1,
            }
        ], STAT_TYPES.WINS)).toBe(1)

        expect(getCumulativeStat([
            {
                win: 1
            },
            {
                win: 1,
            },
            {
                win: 1,
            },
            {
                win: 0
            }
        ], STAT_TYPES.WINS)).toBe(0.75)

        expect(getCumulativeStat([
            {
                win: 1
            },
            {
                win: 1,
            },
            {
                win: 1,
            },
            {
                win: 0
            },
            {
                win: 0,
            },
            {
                win: null
            },
            {
                win: 1
            }
        ], STAT_TYPES.WINS).toFixed(3)).toBe("0.571")
        
    });

    it('should calculate points per game', () => {
        expect(getCumulativeStat([
            {
                points_for: 5
            },
            {
                points_for: 4,
            },
            {
                points_for: null
            },
            
        ], STAT_TYPES.POINTS_FOR_PER_GAME)).toBe(3)
    })

    it('should calculate points against per game', () => {
        expect(getCumulativeStat([
            {
                points_against: 5
            },
            {
                points_against: 4,
            },
            {
                points_against: null
            },
            
        ], STAT_TYPES.POINTS_AGAINST_PER_GAME)).toBe(3)
    })

    it('should calculate hammer efficiency', () => {
        expect(getCumulativeStat([
            {
                hammer_conversion_count: 4,
                hammer_blank_count: 1,
                hammer_end_count: 6
            },
            {
                hammer_conversion_count: 2,
                hammer_blank_count: 2,
                hammer_end_count: 6
            },
        ], STAT_TYPES.HAMMER_EFFICIENCY).toFixed(2)).toBe("0.67")

        expect(getCumulativeStat([
            {
                hammer_conversion_count: 4,
                hammer_blank_count: null,
                hammer_end_count: 6
            },
        ], STAT_TYPES.HAMMER_EFFICIENCY).toFixed(2)).toBe("0.67")
        expect(getCumulativeStat([
            {
                hammer_conversion_count: null,
                hammer_blank_count: null,
                hammer_end_count: null
            },
        ], STAT_TYPES.HAMMER_EFFICIENCY)).toBe(0)

        expect(getCumulativeStat([
            {
                hammer_conversion_count: null,
                hammer_blank_count: null,
                hammer_end_count: null
            },
            {
                hammer_conversion_count: 1,
                hammer_blank_count: 1,
                hammer_end_count: 5
            },
        ], STAT_TYPES.HAMMER_EFFICIENCY)).toBe(0.25)
    })

    it('should calculate steal efficiency', () => {
        expect(getCumulativeStat([
            {
                non_hammer_steal_count: 1,              
                non_hammer_end_count: 4
            },
        ], STAT_TYPES.STEAL_EFFICIENCY)).toBe(0.25)
        expect(getCumulativeStat([
            {
                non_hammer_steal_count: null,              
                non_hammer_end_count: 6
            },
            {
                non_hammer_steal_count: 1,              
                non_hammer_end_count: 4
            },
        ], STAT_TYPES.STEAL_EFFICIENCY)).toBe(0.1)
        expect(getCumulativeStat([
            {
                non_hammer_steal_count: null,              
                non_hammer_end_count: null
            },
            {
                non_hammer_steal_count: 2,              
                non_hammer_end_count: 4
            },
            {
                non_hammer_steal_count: null,              
                non_hammer_end_count: 6
            },
        ], STAT_TYPES.STEAL_EFFICIENCY)).toBe(0.2)
    })

    it('should calculate force efficiency', () => {
        expect(getCumulativeStat([
            {
                non_hammer_force_count: 1,              
                non_hammer_end_count: 4
            },
        ], STAT_TYPES.FORCE_EFFICIENCY)).toBe(0.25)
        expect(getCumulativeStat([
            {
                non_hammer_force_count: null,              
                non_hammer_end_count: 4
            },
        ], STAT_TYPES.FORCE_EFFICIENCY)).toBe(0)
        expect(getCumulativeStat([
            {
                non_hammer_force_count: null,              
                non_hammer_end_count: null
            },
            {
                non_hammer_force_count: 1,              
                non_hammer_end_count: 4
            },
            {
                non_hammer_force_count: 0,              
                non_hammer_end_count: 6
            },
        ], STAT_TYPES.FORCE_EFFICIENCY)).toBe(0.1)
    })

    it('should calculate steal defense', () => {
        expect(getCumulativeStat([
            {
                hammer_steal_count: 1,              
                hammer_end_count: 4
            },
        ], STAT_TYPES.STEAL_DEFENSE)).toBe(0.75)
        expect(getCumulativeStat([
            {
                hammer_steal_count: null,              
                hammer_end_count: 6
            },
            {
                hammer_steal_count: 1,              
                hammer_end_count: 4
            },
        ], STAT_TYPES.STEAL_DEFENSE)).toBe(0.9)
        expect(getCumulativeStat([
            {
                hammer_steal_count: null,              
                hammer_end_count: null
            },
        ], STAT_TYPES.STEAL_DEFENSE)).toBe(1)
    })

    it('should calculate blank ends', () => {
        expect(getCumulativeStat([
            {
                hammer_blank_count: 1,              
                hammer_end_count: 4
            },
        ], STAT_TYPES.BLANK_ENDS)).toBe(0.25)
        expect(getCumulativeStat([
            {
                hammer_blank_count: null,              
                hammer_end_count: 4
            },
            {
                hammer_blank_count: 1,              
                hammer_end_count: 1
            },
        ], STAT_TYPES.BLANK_ENDS)).toBe(0.2)
        expect(getCumulativeStat([
            {
                hammer_blank_count: null,              
                hammer_end_count: null
            },
        ], STAT_TYPES.BLANK_ENDS)).toBe(0)
    })

    it('should calculate ends for per game', () => {
        expect(getCumulativeStat([
            {
                ends_for: 6,
            },
            {
                ends_for: null
            },
            {
                ends_for: 0
            }
        ], STAT_TYPES.ENDS_FOR_PER_GAME)).toBe(2)
    })

    it('should calculate ends against per game', () => {
        expect(getCumulativeStat([
            {
                ends_against: 6,
            },
            {
                ends_against: null
            },
            {
                ends_against: 0
            }
        ], STAT_TYPES.ENDS_AGAINST_PER_GAME)).toBe(2)
    })

    it('should calculate hammer last end frequency', () => {
        expect(getCumulativeStat([
            {
                hammer_last_end_count: 1,
            },
            {
                hammer_last_end_count: null
            },
            {
                hammer_last_end_count: 0
            },
            {
                hammer_last_end_count: 0
            }
        ], STAT_TYPES.HAMMER_LAST_END)).toBe(0.25)
    })

    it('should calculate points for per end', () => {
        expect(getCumulativeStat([
            {
                points_for: 1,
                ends_played: 6,
            },
            {
                points_for: 2,
                ends_played: null,
            },
            {
                points_for: 4,
                ends_played: 8,
            },
            
        ], STAT_TYPES.POINTS_PER_END)).toBe(0.5)
    })

    it('should calculate points with hammer', () => {
        expect(getCumulativeStat([
            {
                points_with_hammer: 1,
                hammer_end_count: 6,
            },
            {
                points_with_hammer: null,
                hammer_end_count: null,
            },
            {
                points_with_hammer: 3,
                hammer_end_count: 4,
            },
            
            
        ], STAT_FIELDS.WITH_HAMMER)).toBe(0.4)
    })

    it('should calculate points without hammer', () => {
        expect(getCumulativeStat([
            {
                points_without_hammer: 1,
                non_hammer_end_count: 6,
            },
            {
                points_without_hammer: null,
                non_hammer_end_count: null,
            },
            {
                points_without_hammer: 3,
                non_hammer_end_count: 4,
            },
            
            
        ], STAT_FIELDS.WITHOUT_HAMMER)).toBe(0.4)
    })

    // it('should calculate points with hammer', () => {
    //     expect(getCumulativeStat([
    //         {
    //            points_with_hammer: 6,              
    //             hammer_end_count: 6,
    //         },
           
    //     ], STAT_FIELDS_TOTAL[STAT_FIELDS.WITH_HAMMER])).toBe(1)

    //     expect(getCumulativeStat([
    //         {
    //            points_with_hammer: 6,              
    //             hammer_end_count: 6,
    //         },
    //         {
    //             points_with_hammer: null,
    //             hammer_end_count: null,
    //         }
           
    //     ], STAT_FIELDS_TOTAL[STAT_FIELDS.WITH_HAMMER])).toBe(1)
    // })
    
})
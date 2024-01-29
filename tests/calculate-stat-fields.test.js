import { describe, expect, it } from "vitest";
import { defaultFieldCalculator } from '../utils/stats/index';
import {STAT_FIELDS, STAT_TYPES} from '../constants/stats'
describe("it should calculate the correct stats for stat subfields", () => {
    it('should calculate wins with color', () => {
        expect(defaultFieldCalculator(STAT_FIELDS.YELLOW)({
            stats: [
                {
                    win: 1,
                    color: 'blue'
                },
                {
                    win: 1,
                    color: 'red'
                },
                {
                    win: 1,
                    color: 'yellow'
                }
            ],
            statType: STAT_TYPES.WINS
        })).toBe(1)
    })

    it('should calculate points per end with color', () => {
        expect(defaultFieldCalculator(STAT_FIELDS.YELLOW)({
            stats: [
                {
                    points_for: 5,
                    ends_played: 8,
                    color: 'blue'
                },
                {
                    points_for: 5,
                    ends_played: 8,
                    color: 'red'
                },
                {
                    points_for: 4,
                    ends_played: 8,
                    color: 'yellow'
                },
                {
                    points_for: 12,
                    ends_played: 8,
                    color: 'yellow'
                },
            ],
            statType: STAT_TYPES.POINTS_PER_END
        })).toBe(1)
    })

    it('should calculate hammer efficiency with color', () => {
        expect(defaultFieldCalculator(STAT_FIELDS.YELLOW)({
            stats: [
                {
                    hammer_conversion_count: 4,
                    hammer_end_count: 4,
                    hammer_blank_count: 0,
                    color: 'blue'
                },
                {
                    hammer_conversion_count: 4,
                    hammer_end_count: 4,
                    hammer_blank_count: 0,
                    color: 'blue'
                },
                {
                    hammer_conversion_count: 4,
                    hammer_end_count: 5,
                    hammer_blank_count: 1,
                    color: 'yellow'
                },
            ],
            statType: STAT_TYPES.HAMMER_EFFICIENCY
        })).toBe(1)
    })

    it('should calculate points per end with hammer', () => {
        expect(defaultFieldCalculator(STAT_FIELDS.WITH_HAMMER)({
            stats: [
                {
                    points_with_hammer: 6,
                    hammer_end_count: 4,
                    
                },
                {
                    points_with_hammer: 2,
                    hammer_end_count: 4,
                    
                },
               
            ],
            statType: STAT_TYPES.POINTS_PER_END
        })).toBe(1)
    })
})
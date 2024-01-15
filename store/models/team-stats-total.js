import { Model } from "pinia-orm";

export default class TeamStatsTotal extends Model {
    static entity = "team-stats-total";

    static primaryKey = ["team_id"];

    static fields() {
        return {
            ends_for: this.number(0),
            ends_against: this.number(0),
            ends_difference: this.number(0),
            ends_for_percentile: this.number(0),
            ends_against_percentile: this.number(0),
            ends_difference_percentile: this.number(0),
            force_efficiency: this.number(0),
            force_efficiency_percentile: this.number(0),
            games_played: this.number(0),
            hammer_conversion_average: this.number(0),
            hammer_conversion_percentile: this.number(0),
            hammer_first_end: this.number(0),
            hammer_first_end_percentile: this.number(0),
            hammer_last_end: this.number(0),
            hammer_last_end_percentile: this.number(0),
            team_id: this.number(0),
            points_for: this.number(0),
            points_for_percentile: this.number(0),
            points_against: this.number(0),
            points_against_percentile: this.number(0),
            points_difference: this.number(0),
            points_difference_percentile: this.number(0),
            steal_defense: this.number(0),
            steal_defense_percentile: this.number(0),
            steal_efficiency: this.number(0),
            steal_efficiency_percentile: this.number(0),
            wins: this.number(0),
            wins_average: this.number(0),
            wins_percentile: this.number(0),
            ends_played: this.number(0)
        };
    }
    get winPercent () {
        return Number.parseInt((this.wins_average * 100).toFixed(2))
    }
    get winPercentile() {
        return Number.parseInt((this.wins_percentile * 100).toFixed(2))
    }

    get HFEPercent () {
        return Number.parseInt((this.hammer_first_end * 100).toFixed(2))
    }
    get HFEPercentile () {
        return Number.parseInt((this.hammer_first_end_percentile * 100).toFixed(2))
    }
    get HLEPercent () {
        return Number.parseInt((this.hammer_last_end * 100).toFixed(2))
    }
    get HLEPercentile () {
        return Number.parseInt((this.hammer_last_end_percentile * 100).toFixed(2))
    }
}

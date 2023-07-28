

const toPercent = (num) => {
    return (num * 100).toFixed();
};

export const calculateTeamStats = (stats) => {
    const {
        avg_points_conceded,
        forced_end_count,
        hammer_1_point_count,
        hammer_blank_count,
        hammer_ends_count,
        stolen_end_count,
        total_ends_played,
        team_avg
    } = stats;

    const addPointCounts = (start, end) => {
        if (start < 1 || end > 8) return;
        let sum = 0;
        for (let x = start; x < end; x++) {
            sum += stats[`hammer_${x}_point_count`];
        }
        return sum;
    };

    // Average points conceded without hammer
    const avgPointsConceded = avg_points_conceded.toFixed(2);

    // Blank ends: % of ends with hammer when score was 0
    const blankEnds = toPercent(hammer_blank_count / hammer_ends_count);

    // Of all ends played, what % of the time did the team have the hammer?
    const controlOfGame = toPercent(hammer_ends_count / total_ends_played);

    // forced with hammer: % of ends with hammer when team only scored 1
    const forcedWith = toPercent(
        hammer_1_point_count / (hammer_ends_count - hammer_blank_count)
    );
    // forced opposition to take one when they had hammer
    const forceWithout = toPercent(
        forced_end_count / (total_ends_played - hammer_ends_count)
    );

    // Hammer efficiency -- scored 2+ points with hammer. NOT INCLUDING blanks
    const hammerConversion = toPercent(
        addPointCounts(2, 8) / (hammer_ends_count - hammer_blank_count)
    );

    // How many ends did they steal?
    const stolenEnds = toPercent(
        stolen_end_count / (total_ends_played - hammer_ends_count)
    );

    // Average shot % for whole team
    const teamAverage = toPercent(Number(team_avg) / 4);

    return {
        avgPointsConceded,
        blankEnds,
        controlOfGame,
        forcedWith,
        forceWithout,
        hammerConversion,
        stolenEnds,
        teamAverage
    };
};

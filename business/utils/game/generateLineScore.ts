export default (ends: any, end_count: number, home: object, away: object) => {
    const s = Array.from(
        {
            length: end_count,
        },
        (_, i) => i + 1
    ).reduce((all, current, index) => {
        if (!ends[index]) {
            return {
                ...all,
                [index + 1]: {
                    home: "X",
                    away: "X",
                },
            };
        } else {
            return {
                ...all,
                [index + 1]: {
                    home:
                        ends[index]?.points_scored === null
                            ? "X"
                            : ends[index]?.scoring_team_id ===
                              home.team_id
                            ? ends[index]?.points_scored
                            : 0,
                    away:
                        ends[index]?.points_scored === null
                            ? "X"
                            : ends[index]?.scoring_team_id ===
                                  away.team_id 
                            ? ends[index]?.points_scored
                            : 0,
                    ...ends[index],
                },
            };
        }
    }, {});
    return s;
}
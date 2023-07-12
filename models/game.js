const {formatDate} = useFormat();
export const gameModel = (game = {}) => {
    const {away ={}, home = {}, name, start_time, ends, id, home_color, away_color, hammer_first_end} = game;
    const [data] = ends ?? [];
    return {
        start_time: formatDate(start_time),
        home: {
            ...home,
            name: home?.name ?? 'N/A'
        },
        away: {
            ...away,
            name: away?.name ?? 'N/A'
        },
        name: name ?? `${homeTeam} vs ${awayTeam}`,
        ends: data?.count || 0,
        id,
        home_color,
        away_color,
        hammer_first_end: {
            ...hammer_first_end,
            name: hammer_first_end?.name ?? 'N/A'
        }
    }
    
};
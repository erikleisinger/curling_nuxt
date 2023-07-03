const {formatDate} = useFormat();
export const gameModel = (game = {}) => {
    const {away, home, name, start_time, ends, id} = game;
    const homeTeam = home?.name ?? 'N/A';
    const awayTeam = away?.name ?? 'N/A'
    const [data] = ends ?? [];
    return {
        start_time: formatDate(start_time),
        home: homeTeam,
        away: awayTeam,
        name: name ?? `${homeTeam} vs ${awayTeam}`,
        ends: data?.count || 0,
        id,
    }
    
};
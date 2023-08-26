export const useGame = () => {
    const getTeamGames = async (team_ids_param: number[], start: number = 0, end: number = 5) => {
        const client = useSupabaseClient();
        const { data } = await client.rpc("get_team_record", { team_ids_param }).range(start, end).order('start_time', {ascending: false});
        if (data) return data?.map((d) => ({
            ...d,
            end_count: d.end_count,
            id: d.id,
            is_home_team: d.is_home_team,
            event_color: d.event_color,
            event_name: d.event_name,
            rink_name: d.rink_name,
            sheet_name: d.sheet_name,
            start_time: d.start_time
        }));
        return []
    }
    return { getTeamGames };
};

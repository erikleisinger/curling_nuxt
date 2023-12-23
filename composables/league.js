import League from '@/store/models/league'
import LeagueAdmin from '@/store/models/league-admin'
import LeagueTeam from '@/store/models/league-team'
import LeagueDrawtime from '@/store/models/league-drawtime'
import Player from '@/store/models/player'
import Team from '@/store/models/team'


export const useLeague = () => {
    const client = useSupabaseClient();
    const getLeagueAdmins = async (leagueIds) => {
        const {data: admins} = await client.from('league_admins').select(`
            id,
            created_at,
            league_id,
            profile:profile_id (
                id,
                first_name,
                last_name,
                avatar,
                rink_id,
                username
            )
        `).in('league_id', leagueIds)

        console.log('got admins: ', admins)

        useRepo(LeagueAdmin).query().whereIn('league_id', leagueIds).where('id', (val) => {
            return !admins.some(({id}) => id === val)
        }).delete();

        
            admins.forEach((admin) => {
                    const {profile} = admin;
                useRepo(Player).save({...profile})
                useRepo(LeagueAdmin).save({
                    id: admin.id,
                    league_id: admin.league_id,
                    profile_id: admin?.profile?.id
                })
            })
    }
    
    const getLeagueTeams = async (leagueIds) => {
        const {data:teams} = await client.from('league_teams').select(`
            id,
            created_at,
            team:team_id (
                id,
                name,
                avatar_url
            ),
            league_id
        `).in('league_id', leagueIds)

        useRepo(LeagueTeam).query().whereIn('league_id', leagueIds).where('team_id', (val) => {
            return !teams.some(({team}) => team?.id === val)
        }).delete();

        teams.forEach((leagueTeam) => {
            const {team} = leagueTeam;
            useRepo(Team).save({
                ...team
            })
            useRepo(LeagueTeam).save({
                id: leagueTeam.id,
                created_at: leagueTeam.created_at,
                league_id: leagueTeam.league_id,
                team_id: team?.id
            })
        })
    }

    const getLeagueDrawTimes = async (leagueIds) => {
        const {data: drawtimes} = await client.from('league_drawtimes').select(`
            id,
            created_at,
            time,
            league_id
        `).in('league_id', leagueIds);

        useRepo(LeagueDrawtime).query().whereIn('league_id', leagueIds).where('id', (val) => {
            return !drawtimes.some(({id}) => id === val)
        }).delete();

        drawtimes.forEach((drawtime) => {
            useRepo(LeagueDrawtime).save({
                ...drawtime
            })
        })
    }


    const getRinkLeagues = async (rinkId) => {
        const {data: leagues, error} = await client.from('leagues').select(`
            id,
            created_at,
            name,
            color,
            font_color,
            icon,
            rink_id
        `).eq('rink_id', rinkId)

        leagues.forEach((league) => {        
            useRepo(League).save({...league})
        })

        const leagueIds = leagues.map(({id}) => id);

        await Promise.all([getLeagueAdmins(leagueIds), getLeagueTeams(leagueIds), getLeagueDrawTimes(leagueIds)])
      

        return leagues;
    }
    return {getRinkLeagues, getLeagueAdmins, getLeagueDrawTimes, getLeagueTeams}
}
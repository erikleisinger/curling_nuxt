import { useRepo } from "pinia-orm";
import useQuery from '@/business/api/query'
import Game from '@/store/models/game'
import Team from '@/store/models/team'
import GameTeam from "@/store/models/game-team";
import generateLineScore from '@/business/utils/game/generateLineScore'

const getScoreDetails = async (client: any, gameId: number) => {
    const { data } = await client
        .from("ends")
        .select(
            `
        id,
        end_number,
        scoring_team_id,
        hammer_team_id,
        points_scored
    `
        )
        .eq("game_id", gameId);
    return data;
};

const getEndCount = async (client: any, gameId: number) => {
    const { data } = await client
        .from("games")
        .select(
            `
        end_count
    `
        )
        .eq("id", gameId).single()
    useRepo(Game).where('id', gameId).update({end_count: data.end_count})
    return data.end_count;
}

const getGameTeams = async (client: any, gameId: number) => {
    if (useRepo(GameTeam).where('game_id', gameId).get().length < 2) {
        const { data } = await client
        .from("game_team_junction")
        .select(
            `
            team:team_id (
                id,
                name,
                avatar_url
            ),
            color,
            placeholder,
            pending
    `
        )
        .eq("game_id", gameId);

        data.forEach((item) => {
            const {team, color, placeholder, pending} = item;
            useRepo(Team).save(team);
            useRepo(GameTeam).save({
                game_id: gameId,
                team_id: team.id,
                pending,
                color,
                placeholder
            })
        })
    }

    return useRepo(GameTeam).where('game_id', gameId).get()
    
}

const getGameScore = async (client: any, gameId: number) => {
    const details = await getScoreDetails(client, gameId);
    let end_count;
    end_count = useRepo(Game).where('id', gameId).first()?.end_count;
    if (!end_count) {
        end_count = await getEndCount(client, gameId)
    }

    const [home, away] = await getGameTeams(client, gameId)

    return generateLineScore(details, end_count,home, away)
    
};


export default (client: any, gameId: number, options: object) => {
    const defaultScore = Array.from(Array(8).keys()).reduce((all, current, index) => {
        return {
            ...all,
            [index + 1]: {
                home: 0,
                away: 0
            }
        }
    }, {})
    return useQuery({
        queryKey: ["game", "score", gameId],
        queryFn: () => getGameScore(client, gameId),
        refetchOnWindowFocus: false,
        placeholderData: defaultScore,
        ...options
    });
};
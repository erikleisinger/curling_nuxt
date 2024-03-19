import { getGameInfo } from "@/service/api/query/game";
import {getRink} from '@/business/api/query/rink'
import {getSheet} from '@/business/api/query/sheet'
import {getGameEndDetails, getGameTeams} from '@/business/api/query/game'
import { useRepo } from "pinia-orm";
import Game from '@/store/models/game'
import dayjs from 'dayjs'
import client from '@/service/client'
export const getFullGame = (gameId: number) => {

    return async (onChange: Function) => {

        const game = await client.fetch({
            queryFunc: () => getGameInfo(gameId),
            queryKey: `game-${gameId}-info`,
            onChange: (data) => {
                useRepo(Game).save({
                    ...data,
                    start_time: dayjs(data.start_time).unix()
                });
            }
        })
        
        const {end_count} = game;

        const {rink_id, sheet_id} = game;
        if (rink_id) {
            await getRink(rink_id)()
        }
        if (sheet_id) {
            await getSheet(sheet_id)()
        }
       
        const ends = await getGameEndDetails(gameId)();

        const firstEnd = ends?.find(({end_number}) => end_number === 1)
        const {hammer_team_id: hammer_first_end} = firstEnd;
        const ends_played = ends?.length;
        const end_early = ends_played < end_count;


        const {start_time} = game;

        const gameToInsert = {
            ...game,
            start_time: dayjs(start_time).unix(),
            end_early,
            hammer_first_end,
            ends_played
        }

        useRepo(Game).save(gameToInsert);

       const teams = await getGameTeams(gameId)();

        return {
            game: gameToInsert,
            ends,
            teams
        }

    }
}
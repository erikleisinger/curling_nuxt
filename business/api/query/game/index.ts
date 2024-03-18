import {getGameScore} from '@/business/api/query/game/score';
import getGameEndDetails from '~/business/api/query/game/getGameEndDetails';
import getGameTeams from '@/business/api/query/game/getGameTeams';
import { getFullGame } from '@/business/api/query/game/getFullGame';


export {
    getFullGame,
    getGameScore,
    getGameEndDetails,
    getGameTeams
}
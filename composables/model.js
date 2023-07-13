import { gameModel } from "@/models/game"
import {newShot} from '@/models/shot'

export const useModel = () => {
    return {gameModel, newShot}
}
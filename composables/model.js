import { gameModel } from "@/models/game"
import {newShot, shotEdited} from '@/models/shot'

export const useModel = () => {
    return {gameModel, newShot, shotEdited}
}
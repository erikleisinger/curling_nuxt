import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
    state: () => {
        return {
            game: null,

        }
    },
    actions: {
        setGame(game) {
            this.game = game
        }
    }
})
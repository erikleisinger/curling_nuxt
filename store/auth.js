import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
           loggedIn: false
        }
    },
    getters: {
        isLoggedIn: (state) => {
            return state.loggedIn
        },
    },
    actions: {
        setLoggedIn(bool) {
            this.loggedIn = bool;
        }
    }
})
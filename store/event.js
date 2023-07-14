import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', {
    state: () => {
        return {
            rockSelected: false
        }
    },
    actions: {
        toggleRockSelected() {
            this.rockSelected = !this.rockSelected
        }
    }
})
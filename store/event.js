import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', {
    state: () => {
        return {
            rockSelected: null
        }
    },
    actions: {
        toggleRockSelected(val) {
            this.rockSelected = val
        }
    }
})
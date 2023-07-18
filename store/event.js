import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', {
    state: () => {
        return {
            rockSelected: null,
            draggingOOB: false,
        }
    },
    actions: {
        toggleDraggingOOB(val) {
            this.draggingOOB = val
        },
        toggleRockSelected(val) {
            this.rockSelected = val
        }
    }
})
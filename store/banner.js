import { defineStore } from 'pinia';

export const useBannerStore = defineStore('banner', {
    state: () => {
        return {
            text: null,
        }
    },
    actions: {
        clear() {
            this.text = null;
        },
        setText(text) {
            if (!text) return;
            this.text = text;
        }
    }
})
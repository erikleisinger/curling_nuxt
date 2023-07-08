import { defineStore } from 'pinia';

export const useBannerStore = defineStore('banner', {
    state: () => {
        return {
            color: 'primary',
            text: null,
        }
    },
    actions: {
        clear() {
            this.color = 'primary'
            this.text = null;
        },
        setText(text, color) {
            if (!text) return;
            this.text = text;
            if (color) this.color = color;
        }
    }
})
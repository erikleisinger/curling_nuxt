import { defineStore } from 'pinia';
import { BannerColors } from '@/types/color';

interface BannerStoreState {
    color: BannerColors
    text: string | null
}

export const useBannerStore = defineStore('banner', {
    state: (): BannerStoreState => {
        return {
            color: BannerColors.Primary,
            text: null,
        }
    },
    actions: {
        clear() {
            this.color = BannerColors.Primary,
            this.text = null;
        },
        setText(text: string, color: BannerColors) {
            if (!text) return;
            this.text = text;
            if (color) this.color = color;
        }
    }
})
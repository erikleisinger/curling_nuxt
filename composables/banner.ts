import {useBannerStore} from '@/store/banner' 
import type { BannerColors } from 'types/color';
export const useBanner = () => {
    const store = useBannerStore();

    const setBanner = (text: string, color: BannerColors) => {
        store.setText(text, color)
    }  
    const clearBanner= () => {
        store.clear()
    } 

    return {setBanner, clearBanner}
    
}
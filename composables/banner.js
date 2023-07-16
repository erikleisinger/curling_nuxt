import {useBannerStore} from '@/store/banner' 
export const useBanner = () => {
    const store = useBannerStore();

    const setBanner = (text, color) => {
        store.setText(text, color)
    }  
    const clearBanner= () => {
        store.clear()
    } 

    return {setBanner, clearBanner}
    
}
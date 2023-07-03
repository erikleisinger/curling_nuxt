import {useBannerStore} from '@/store/banner' 
export const useBanner = () => {
    const store = useBannerStore();

    const setBanner = (text) => {
        store.setText(text)
    }  
    const clearBanner= () => {
        store.clear()
    } 

    return {setBanner, clearBanner}
    
}
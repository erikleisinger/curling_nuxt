import {computed} from 'vue'
import {useGameStore} from '@/store/game'
export const useLoading = () => {
    const store = useGameStore()
    const globalLoading = computed<boolean>(() => store.loading)
    return {globalLoading}
};
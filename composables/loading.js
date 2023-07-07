import {computed} from 'vue'
import {useGameStore} from '@/store/game'
export const useLoading = () => {
    const store = useGameStore()
    const globalLoading = computed(() => store.loading)
    return {globalLoading}
};
import {computed} from 'vue'
import {useSessionStore} from '@/store/session'
export const useLoading = () => {
    const store = useSessionStore()
    const globalLoading = computed<boolean>(() => store.loading)
    return {globalLoading}
};
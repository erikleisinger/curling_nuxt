import {useUserStore} from '@/store/user'
export const useUser = () => {
    const store = useUserStore();
    const user = computed(() => store.id)
    return {user}
}
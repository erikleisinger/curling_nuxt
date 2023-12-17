import {useSessionStore} from '@/store/session'
export const useLoading = () => {
    const store = useSessionStore()
    const globalLoading = computed<boolean>(() => store.loading)

    const {setLoading,setPageLoading} = store;
    return {globalLoading, setLoading, setPageLoading}
};
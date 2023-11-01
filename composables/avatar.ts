import { useQuery} from '@tanstack/vue-query'

export const useAvatar = () => {
    const getTeamAvatar = (url: string, enabled: boolean) => {
        return  useQuery({
            queryKey: ['avatar', 'team', url],
            queryFn:  async () => {
                const {data, error} = await useSupabaseClient().storage.from("Avatars").download(url)
                return URL.createObjectURL(data);
            },
            enabled,
            refetchOnWindowFocus: false,
            cacheTime: Infinity,
            staleTime: Infinity
        })
    }
   

    return {getTeamAvatar}
    
}
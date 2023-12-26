import {useQuery} from "@tanstack/vue-query";
import Rink from '@/store/models/rink'

export const useRink = () => {
    const fetchAndSaveRink = async (rinkId) => {
        const client = useSupabaseClient();
        const { data } = await client
            .from("rinks")
            .select("*")
            .eq("id", rinkId)
            .single();
           
            useRepo(Rink).save(data)
            const rink = useRepo(Rink).where('id', rinkId).first()
        return rink;
    }
    const getRink = (rinkId, opts) => {
        return useQuery({
            queryKey: ["rink", rinkId],
            queryFn: () => fetchAndSaveRink(rinkId),
            ...opts,
            refetchOnWindowFocus: false,
           
        });
    }
    return { getRink };
};

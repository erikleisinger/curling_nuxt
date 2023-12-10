import { useQuery } from "@tanstack/vue-query";
import Team from "@/store/models/team";

export const useAvatar = () => {
    const defaultAvatar = new URL("~/assets/rink.jpg", import.meta.url).href;

    const getAvatarUrl = async (teamId: number) => {
        const client = useSupabaseClient();
        const { data } = await client
            .from("teams")
            .select("avatar_url")
            .eq("id", teamId);
        const [res = {}] = data ?? [];
        const { avatar_url } = res;
        return avatar_url;
    };
    const getAvatar = async (teamId: number) => {
        const url = await getAvatarUrl(teamId);
        if (!url) return defaultAvatar
        const client = useSupabaseClient();

        const { data } = await client.storage.from("Avatars").download(url);
        if (!data) return defaultAvatar;

        const avatar_url = window.URL.createObjectURL(data);
        useRepo(Team).where("id", teamId).update({ avatar_url });
        return avatar_url;
    };

    const getTeamAvatar = (teamId: number, options: object) => {
        return useQuery({
            queryKey: ["teamavatar", teamId],
            queryFn: () => getAvatar(teamId),
            refetchOnWindowFocus: false,
            cacheTime: Infinity,
            staleTime: Infinity,
            ...options,
            placeholderData: defaultAvatar,
        });
    };

    return { getTeamAvatar };
};

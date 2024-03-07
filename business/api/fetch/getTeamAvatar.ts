import useQuery from '@/business/api/query'
import Team from '@/store/models/team'

const defaultAvatar = new URL("~/assets/rink.jpg", import.meta.url).href;

const getAvatarUrl = async (teamId: number, client: any) => {
    const { data } = await client
        .from("teams")
        .select("avatar_url")
        .eq("id", teamId);
    const [res = {}] = data ?? [];
    const { avatar_url } = res;
    useRepo(Team).where("id", teamId).update({ avatar_url });
    return avatar_url;
};

const getAvatar = async (teamId: number, client: any) => {
    const url = useRepo(Team).where("id", teamId).first()?.avatar_url || await getAvatarUrl(teamId, client);

    if (!url) return defaultAvatar

    const { data } = await client.storage.from("Avatars").download(url);
    if (!data) return defaultAvatar;

    const avatar_url = window.URL.createObjectURL(data);
   
    return avatar_url;
};

export default (client: any, teamId: number, options: object) => {
    return useQuery({
        queryKey: ["teamavatar", teamId],
        queryFn: () => getAvatar(teamId, client),
        refetchOnWindowFocus: false,
        cacheTime: Infinity,
        staleTime: Infinity,
        ...options,
        placeholderData: defaultAvatar,
    });
};
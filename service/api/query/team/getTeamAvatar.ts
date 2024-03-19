import client from '@/service/client';
import runQuery from '@/service/api/query/runQuery';
const defaultAvatar = new URL("~/presentation/assets/rink.jpg", import.meta.url).href;

export const getAvatarUrl = async (teamId: number) => {
    const data = await runQuery(async () => await client.client
    .from("teams")
    .select("avatar_url")
    .eq("id", teamId))
    const [res = {}] = data ?? [];
    const { avatar_url } = res;
    return avatar_url;
};

export const getAvatar = async (teamId: number) => {
    if (!teamId) return defaultAvatar
    const url = await getAvatarUrl(teamId);

    if (!url) return defaultAvatar


    const data = await runQuery(async () => await client.client.storage.from("Avatars").download(url));
    if (!data) return defaultAvatar;

    const avatar_url = window.URL.createObjectURL(data);
   
    return avatar_url;
};
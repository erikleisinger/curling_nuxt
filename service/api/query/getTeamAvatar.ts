import { supabaseClient } from '@/service/client/createClient';

const defaultAvatar = new URL("~/assets/rink.jpg", import.meta.url).href;

export const getAvatarUrl = async (teamId: number) => {
    const client = supabaseClient();
    const { data } = await client
        .from("teams")
        .select("avatar_url")
        .eq("id", teamId);
    const [res = {}] = data ?? [];
    const { avatar_url } = res;
    return avatar_url;
};

export const getAvatar = async (teamId: number) => {
    const url = await getAvatarUrl(teamId);

    if (!url) return defaultAvatar

    const client = supabaseClient();

    const { data } = await client.storage.from("Avatars").download(url);
    if (!data) return defaultAvatar;

    const avatar_url = window.URL.createObjectURL(data);
   
    return avatar_url;
};
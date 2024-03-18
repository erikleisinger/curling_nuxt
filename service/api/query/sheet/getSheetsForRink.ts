import client from '@/service/client'
export const getSheetsForRink = async (rinkId: number) => {
    const { data } = await client.client
        .from("sheets")
        .select("*")
        .eq("rink_id", rinkId);
    return data;
};
import client from '@/service/client'
export default async ({
    id,
    name,
    rink,
}: {
    id: number,
    name: string,
    rink: number | object,
}) => {

    const rink_id = typeof rink === 'string' ? rink : rink?.id;
        await client.client
            .from("teams")
            .update({
                name,
                rink_id,
            })
            .eq("id", id);
}
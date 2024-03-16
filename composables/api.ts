import client from "@/service/client";
export const useApi = () => {
    const result = ref(null);
    const loading = ref(true)

    const fetch = async ({
        queryKey,
        queryFunc,
    }: {
        queryKey: string;
        queryFunc: Function;
    }) => {
        client.fetch({
            queryFunc,
            queryKey,
            changeListener: async (val) => {
                loading.value = true;
                const value = await val;
                result.value = value;
                loading.value = false;
            },
        });
    };

    return { fetch, result, loading };
};

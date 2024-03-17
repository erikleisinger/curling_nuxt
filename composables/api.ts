import client from "@/service/client";
export const useApi = () => {
    const result = ref(null);
    const loading = ref(true)

    const fetch = async (fetchFunction: Function) => {
        const data = await fetchFunction(async (val) => {
            // loading.value = true;
            const value = await val;
            result.value = value;
            // loading.value = false;
        });
        result.value = data;
        loading.value = false;
    };


    return { fetch, result, loading };
};

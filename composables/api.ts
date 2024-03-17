export const useApi = () => {
    const result = ref(null);
    const loading = ref(true)

    const fetch = async (fetchFunction: Function) => {
        const data = await fetchFunction(async (val) => {
            const value = await val;
            result.value = value;
        });
        result.value = data;
        loading.value = false;

        return data;
    };


    return { fetch, result, loading };
};

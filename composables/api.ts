export const useApi = () => {
    const defaultFetchOptions = {
        enabled: true,
        onComplete: () => {}
    }
    const fetch = (fetchFunction: Function, {enabled, onComplete} : {enabled: boolean, onComplete: Function} = defaultFetchOptions) => {
        
        const result = ref(null);
        const loading = ref(true);
        if (!enabled) return {
            result, 
            loading
        }
        fetchFunction(async (val) => {
            const value = await val;
            result.value = value;
        }).then((data) => {
            result.value = data;
            loading.value = false;

            onComplete(data)
        });

        watch(result, (val) => {
            // console.log('result updated: ', val)
        })
      

        return { result, loading };
    };

    const mutate = async (mutateFunction: Function) => {


        const data = await mutateFunction();
    

        return data;
    }

    

    return { fetch, mutate };
};

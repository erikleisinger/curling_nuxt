import type { Ref } from "vue";
export const useApi = () => {
    const defaultFetchOptions = {
        enabled: ref(true),
        onComplete: () => {},
        errorMsg: "Error occured.",
    };
    const fetch = (
        fetchFunction: Function | Ref,
        {
            enabled = ref(true),
            onComplete = () => {},
            errorMsg = "Error occured.",
        }: {
            enabled: Ref<boolean>;
            onComplete: Function;
            errorMsg?: string;
        } = defaultFetchOptions
    ) => {
        const result = ref(null);
        const loading = ref(true);
        const error = ref(null);

        const functionToCall = computed(() => {
            if (fetchFunction?.value) return fetchFunction.value;
            return fetchFunction;
        });

        if (!enabled.value)
            return {
                result,
                loading,
            };
        const callFunc = () => {
           functionToCall
                .value(async (val) => {
                    error.value = null;
                    const value = await val;
                    result.value = value;
                }).then((data) => {
                    error.value = null;
                    result.value = data;
                    loading.value = false;

                    onComplete(data);
                })
                .catch((e) => {
                    console.error(e);
                    error.value = errorMsg;
                    loading.value = false;
                });
        };

        watch(
            functionToCall,
            () => {
                callFunc();
            },
            { immediate: true }
        );

        return { result, loading, error };
    };

    const defaultNotificationState = {
        progressNotification: null,
        successNotification: null,
        errorNotification: null,
    };


    const mutate = async (
        mutateFunction: Function,
        {
            progressNotification,
            successNotification,
            errorNotification,
        }: {
            progressNotification?: string | null;
            successNotification?: string | null;
            errorNotification?: string | null;
        } = defaultNotificationState
    ) => {
        const data = reactive({
            error: false,
            result: null,
        })


        const {runNotifyFunction} = useNotification();

        

        await runNotifyFunction({
            callback: async () => await mutateFunction()
            .then((res) => {
                console.log('mutation result: ', res)
                data.result = res;
            })
            .catch((e) => {
                data.error = e;
                throw e
            }),
            onProgress: progressNotification,
            onSuccess: successNotification,
            onError: errorNotification
        })

        return data;
    };

    return { fetch, mutate };
};

import { useNotificationStore } from "@/store/notification";

export const useNotification = () => {
    const notStore = useNotificationStore();

    const runNotifyFunction = async ({
        callback,
        onError,
        onSuccess,
        onProgress,
    }: {
        callback: Function,
        onError: string,
        onSuccess: string,
        onProgress: string,
    }) => {
        const notId = notStore.addNotification({
            text: onProgress,
            state: 'pending'
        })

        try {
            const returnVal = await callback();
            notStore.updateNotification(notId, {
                state: 'completed',
                text: onSuccess,
                timeout: 2000,
            })

            return returnVal;
        } catch(e: any) {
            notStore.updateNotification(notId, {
                state: 'failed',
                text: `${e.name || 'Error'}: ${onError || e.message}`,
                timeout: 2000,
            })
            throw e;
        }

      



    }


    return {runNotifyFunction}
};

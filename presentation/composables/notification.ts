import { useNotificationStore } from "@/store/notification";

export const useNotification = () => {
    const notStore = useNotificationStore();

    const runNotifyFunction = async ({
        callback,
        onError,
        onSuccess,
        onProgress,
        throwError = false
    }: {
        callback: Function;
        onError?: string | null;
        onSuccess?: string | null;
        onProgress?: string | null;
        throwError: boolean;
    }) => {
        let notId;
        if (onProgress) {
            notId = notStore.addNotification({
                text: onProgress,
                state: "pending",
            });
        }
        

        try {
            const returnVal = await callback();
            if (onSuccess) {
                notStore.updateNotification(notId, {
                    state: "completed",
                    text: onSuccess,
                    timeout: 2000,
                });
            }
           

            return returnVal;
        } catch (e: any) {
            console.log('catch error in notify: ', e)
            notStore.updateNotification(notId, {
                state: "failed",
                text: `${e.name || "Error"}: ${onError || e.message}`,
                timeout: 10000,
            });
            
            if (throwError) throw e;
        }
    };

    return { runNotifyFunction };
};

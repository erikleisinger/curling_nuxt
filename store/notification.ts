import { defineStore } from "pinia";
import { Notification, NotificationState } from "@/types/notification";

type NotificationCollection = {
    [key: string]: Notification;
};

export const useNotificationStore = defineStore("notification", {
    state: () =>
        ({
            notifications: {},
        } as {
            notifications: NotificationCollection;
        }),
    actions: {
        addNotification({
            text,
            timeout = 5000,
            state = 'completed',
        }: {
            text: string;
            timeout?: number;
            state: NotificationState
        }) {
            const id = Math.floor(Math.random() * 1000000);
            this.notifications[id] = {
                state,
                text,
                timeout,
            };
            return id;
        },
        updateNotification(
            id: number,
            updates: { state?: NotificationState; text?: string, timeout: number }
        ) {
            if (!updates || !Object.keys(updates)?.length) return;
            const notification = this.notifications[id];
            if (!notification) return;
            Object.assign(notification, updates);
        },
        clearNotification(id: number) {
            delete this.notifications[id];
        },
    },
});

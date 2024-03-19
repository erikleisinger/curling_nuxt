import { defineStore } from "pinia";
import type { Notification, NotificationState } from "@/types/notification";

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
            timeout: number;
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
            id: number | null | undefined,
            updates: { state: NotificationState; text: string, timeout: number }
        ) {
            if (!updates || !Object.keys(updates)?.length) return;
            const notification = !!id && this.notifications[id];
            if (!notification) {
                this.addNotification(updates)
            } else {
                Object.assign(notification, {
                    ...updates,
                    timeout: updates.timeout || 5000
                });
            }
           
        },
        clearNotification(id: number) {
            delete this.notifications[id];
        },
    },
});

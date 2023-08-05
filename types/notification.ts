export type NotificationState = 'pending' | 'completed' | 'failed'
export interface Notification {
    text: string,
    state: NotificationState,
    timeout: number,
}
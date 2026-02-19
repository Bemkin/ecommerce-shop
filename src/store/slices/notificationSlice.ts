import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning";
    timestamp: number;
    read: boolean;
}

interface NotificationState {
    notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: [
        {
            id: "1",
            title: "Welcome to ShopHub!",
            message: "Thanks for joining. Start exploring our premium collections today.",
            type: "info",
            timestamp: Date.now(),
            read: false,
        }
    ],
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "timestamp" | "read">>) => {
            state.notifications.unshift({
                ...action.payload,
                id: Math.random().toString(36).substring(7),
                timestamp: Date.now(),
                read: false,
            });
            // Keep only latest 10
            if (state.notifications.length > 10) {
                state.notifications.pop();
            }
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notif = state.notifications.find(n => n.id === action.payload);
            if (notif) notif.read = true;
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => n.read = true);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

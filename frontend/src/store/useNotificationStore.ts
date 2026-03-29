import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import apiClient from '@/utils/api/api.client';
import { toast } from 'sonner';

interface Notification {
    id: string;
    title: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    socket: Socket | null;
    loading: boolean;
    
    // Actions
    init: (userId: string) => void;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    addNotification: (notification: Notification) => void;
    disconnect: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    socket: null,
    loading: false,

    init: (userId: string) => {
        const currentSocket = get().socket;
        if (currentSocket) return;

        const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const socket = io(socketUrl, {
            query: { userId }
        });

        socket.on('connect', () => {
            console.log('[NOTIFICATION_SOCKET]: Connected');
        });

        socket.on('notification:new', (notification: Notification) => {
            get().addNotification(notification);
            toast.info(notification.title, {
                description: notification.content,
                duration: 5000,
            });
        });

        set({ socket });
        get().fetchNotifications();
    },

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const res = await apiClient.get('/notifications');
            const notifications = res.data;
            const unreadCount = notifications.filter((n: any) => !n.isRead).length;
            set({ notifications, unreadCount });
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            set({ loading: false });
        }
    },

    addNotification: (notification: Notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    },

    markAsRead: async (id: string) => {
        try {
            await apiClient.put(`/notifications/${id}/read`);
            set((state) => ({
                notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    },

    markAllAsRead: async () => {
        try {
            await apiClient.put('/notifications/read-all');
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    }
}));

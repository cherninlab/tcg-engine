import { notifications } from '@mantine/notifications';
import { createContext, ReactNode, useContext } from 'react';

interface NotificationsContextType {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
    showInfo: (message: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const showSuccess = (message: string) => {
        notifications.show({
            title: 'Success',
            message,
            color: 'green',
        });
    };

    const showError = (message: string) => {
        notifications.show({
            title: 'Error',
            message,
            color: 'red',
        });
    };

    const showWarning = (message: string) => {
        notifications.show({
            title: 'Warning',
            message,
            color: 'yellow',
        });
    };

    const showInfo = (message: string) => {
        notifications.show({
            title: 'Info',
            message,
            color: 'blue',
        });
    };

    return (
        <NotificationsContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
}

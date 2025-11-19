// System Notification Types

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface SystemNotification {
  id: string;
  type: NotificationType;
  message: string;
  dismissible?: boolean;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  // Optional: show only on specific layouts
  showOn?: ('main' | 'guest' | 'auth')[];
}

export interface SystemNotificationsConfig {
  notifications: SystemNotification[];
  dismissedIds: string[];
}

export const defaultSystemNotificationsConfig: SystemNotificationsConfig = {
  notifications: [],
  dismissedIds: [],
};

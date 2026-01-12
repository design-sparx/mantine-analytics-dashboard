export interface NotificationDto {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: NotificationAction;
  actor?: {
    name: string;
    avatar?: string;
  };
  target?: {
    type: 'page' | 'comment' | 'task' | 'mention' | 'file';
    title?: string;
    url?: string;
  };
  metadata?: {
    workspace?: string;
    pageIcon?: string;
    [key: string]: any;
  };
}

export type NotificationType =
  | 'mention'
  | 'comment'
  | 'update'
  | 'assignment'
  | 'reminder'
  | 'system'
  | 'security'
  | 'invite'
  | 'share';

export interface NotificationAction {
  label: string;
  url?: string;
  type?: 'primary' | 'secondary';
}

export interface NotificationFilter {
  type: 'all' | 'unread' | 'mentions' | 'comments' | 'updates';
  label: string;
}

import {
  Avatar,
  Box,
  Button,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  IconAt,
  IconBell,
  IconBellRinging,
  IconFileText,
  IconLock,
  IconMessage,
  IconRefresh,
  IconShare,
  IconUserPlus,
} from '@tabler/icons-react';

import type { NotificationDto, NotificationType } from '@/types';

interface NotificationItemProps {
  notification: NotificationDto;
  onClick?: () => void;
  onMarkAsRead?: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  const iconProps = { size: 18 };

  switch (type) {
    case 'mention':
      return <IconAt {...iconProps} />;
    case 'comment':
      return <IconMessage {...iconProps} />;
    case 'update':
      return <IconRefresh {...iconProps} />;
    case 'assignment':
      return <IconFileText {...iconProps} />;
    case 'reminder':
      return <IconBellRinging {...iconProps} />;
    case 'security':
      return <IconLock {...iconProps} />;
    case 'invite':
      return <IconUserPlus {...iconProps} />;
    case 'share':
      return <IconShare {...iconProps} />;
    default:
      return <IconBell {...iconProps} />;
  }
};

const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case 'mention':
      return 'blue';
    case 'comment':
      return 'grape';
    case 'update':
      return 'cyan';
    case 'assignment':
      return 'orange';
    case 'reminder':
      return 'yellow';
    case 'security':
      return 'red';
    case 'invite':
      return 'pink';
    case 'share':
      return 'green';
    default:
      return 'gray';
  }
};

export const NotificationItem = ({
  notification,
  onClick,
  onMarkAsRead,
}: NotificationItemProps) => {
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const iconColor = getNotificationColor(notification.type);

  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        width: '100%',
        padding: '16px',
        borderRadius: '6px',
        backgroundColor: notification.read
          ? 'transparent'
          : 'var(--mantine-color-blue-0)',
        transition: 'background-color 100ms ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = notification.read
          ? 'var(--mantine-color-gray-0)'
          : 'var(--mantine-color-blue-1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = notification.read
          ? 'transparent'
          : 'var(--mantine-color-blue-0)';
      }}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <Box
          style={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: `var(--mantine-color-${iconColor}-6)`,
          }}
        />
      )}

      <Group wrap="nowrap" align="flex-start" gap="md" style={{ paddingLeft: notification.read ? 0 : 8 }}>
        {/* Icon or Avatar */}
        {notification.actor?.avatar ? (
          <Avatar
            src={notification.actor.avatar}
            alt={notification.actor.name}
            radius="xl"
            size={36}
          />
        ) : (
          <Box
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: `var(--mantine-color-${iconColor}-1)`,
              color: `var(--mantine-color-${iconColor}-7)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {getNotificationIcon(notification.type)}
          </Box>
        )}

        {/* Content */}
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" fw={500} lineClamp={1}>
            {notification.message}
          </Text>

          {notification.target?.title && (
            <Group gap={4}>
              {notification.metadata?.pageIcon && (
                <Text size="sm">{notification.metadata.pageIcon}</Text>
              )}
              <Text size="xs" c="dimmed" lineClamp={1}>
                {notification.target.title}
              </Text>
            </Group>
          )}

          <Group gap="xs" mt={4}>
            <Text size="xs" c="dimmed">
              {formatTimeAgo(notification.timestamp)}
            </Text>
            {notification.metadata?.workspace && (
              <>
                <Text size="xs" c="dimmed">•</Text>
                <Text size="xs" c="dimmed">
                  {notification.metadata.workspace}
                </Text>
              </>
            )}
          </Group>

          {/* Action Button */}
          {notification.action && (
            <Box mt={8}>
              <Button
                size="xs"
                variant={notification.action.type === 'primary' ? 'filled' : 'light'}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle action click
                }}
              >
                {notification.action.label}
              </Button>
            </Box>
          )}
        </Stack>

        {/* Mark as read button (on hover) */}
        {!notification.read && (
          <Box
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead?.(notification.id);
            }}
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: `2px solid var(--mantine-color-${iconColor}-6)`,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 100ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `var(--mantine-color-${iconColor}-6)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          />
        )}
      </Group>
    </UnstyledButton>
  );
};

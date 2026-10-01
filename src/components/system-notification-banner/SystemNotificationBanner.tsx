'use client';

import { Alert, Anchor, Group, Stack, StackProps, Text } from '@mantine/core';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';

import { useSystemNotifications } from '@/contexts/system-notifications';
import {
  NotificationType,
  SystemNotification,
} from '@/contexts/system-notifications/types';

interface SystemNotificationBannerProps
  extends Pick<StackProps, 'm' | 'mb' | 'mt' | 'my' | 'mx' | 'p'> {
  layout?: 'main' | 'guest' | 'auth';
}

const notificationConfig: Record<
  NotificationType,
  { color: string; icon: React.ReactNode }
> = {
  info: {
    color: 'blue',
    icon: <IconInfoCircle size={20} />,
  },
  warning: {
    color: 'yellow',
    icon: <IconAlertTriangle size={20} />,
  },
  error: {
    color: 'red',
    icon: <IconX size={20} />,
  },
  success: {
    color: 'green',
    icon: <IconCircleCheck size={20} />,
  },
};

const SystemNotificationBanner = ({
  layout,
  ...others
}: SystemNotificationBannerProps) => {
  const { getActiveNotifications, dismissNotification } =
    useSystemNotifications();
  const activeNotifications = getActiveNotifications(layout);

  if (activeNotifications.length === 0) {
    return null;
  }

  return (
    <Stack gap={0} {...others}>
      {activeNotifications.map((notification: SystemNotification) => {
        const config = notificationConfig[notification.type];

        return (
          <Alert
            key={notification.id}
            color={config.color}
            icon={config.icon}
            withCloseButton={notification.dismissible !== false}
            onClose={() => dismissNotification(notification.id)}
            variant="outline"
          >
            <Group gap="xs" wrap="nowrap">
              <Text c={config.color}>{notification.message}</Text>
              {notification.action?.href && (
                <Anchor
                  href={notification.action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  c={config.color}
                  underline="always"
                  style={{ flexShrink: 0 }}
                >
                  {notification.action.label}
                </Anchor>
              )}
            </Group>
          </Alert>
        );
      })}
    </Stack>
  );
};

export default SystemNotificationBanner;

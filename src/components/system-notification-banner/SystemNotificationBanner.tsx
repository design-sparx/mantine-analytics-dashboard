'use client';

import { Alert, Anchor, Group, Stack, StackProps } from '@mantine/core';
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
    icon: <IconInfoCircle size={16} />,
  },
  warning: {
    color: 'yellow',
    icon: <IconAlertTriangle size={16} />,
  },
  error: {
    color: 'red',
    icon: <IconX size={16} />,
  },
  success: {
    color: 'green',
    icon: <IconCircleCheck size={16} />,
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
            bg={`var(--mantine-color-${config.color}-filled)`}
            c="white"
            py="xs"
            px="md"
            icon={config.icon}
            withCloseButton={notification.dismissible !== false}
            onClose={() => dismissNotification(notification.id)}
          >
            <Group gap="xs" wrap="nowrap">
              {notification.message}
              {notification.action?.href && (
                <Anchor
                  href={notification.action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  c="white"
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

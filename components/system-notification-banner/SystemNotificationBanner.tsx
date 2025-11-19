'use client';

import { Anchor, Box, CloseButton, Group, Stack, Text } from '@mantine/core';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';

import { useSystemNotifications } from '@/contexts/system-notifications';
import { NotificationType, SystemNotification } from '@/contexts/system-notifications/types';

interface SystemNotificationBannerProps {
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

const SystemNotificationBanner = ({ layout }: SystemNotificationBannerProps) => {
  const { getActiveNotifications, dismissNotification } = useSystemNotifications();
  const activeNotifications = getActiveNotifications(layout);

  if (activeNotifications.length === 0) {
    return null;
  }

  return (
    <Stack gap={0}>
      {activeNotifications.map((notification: SystemNotification) => {
        const config = notificationConfig[notification.type];

        return (
          <Box
            key={notification.id}
            bg={`var(--mantine-color-${config.color}-filled)`}
            c="white"
            py="xs"
            px="md"
          >
            <Group justify="space-between" align="center" wrap="nowrap" gap="md">
              <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                {config.icon}
                <Text size="sm" truncate>
                  {notification.message}
                </Text>
                {notification.action?.href && (
                  <Anchor
                    href={notification.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    c="white"
                    fw={600}
                    size="sm"
                    underline="always"
                    style={{ flexShrink: 0 }}
                  >
                    {notification.action.label}
                  </Anchor>
                )}
              </Group>
              {notification.dismissible !== false && (
                <CloseButton
                  size="sm"
                  c="white"
                  onClick={() => dismissNotification(notification.id)}
                  aria-label="Dismiss notification"
                />
              )}
            </Group>
          </Box>
        );
      })}
    </Stack>
  );
};

export default SystemNotificationBanner;

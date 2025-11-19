'use client';

import {
  Alert,
  Anchor,
  Box,
  Button,
  CloseButton,
  Group,
  Stack,
  StackProps,
  Text,
} from '@mantine/core';
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
  extends Pick<StackProps, 'm' | 'mb' | 'mt' | 'my' | 'mx'> {
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
            variant="filled"
            color={config.color}
            radius={0}
            icon={config.icon}
            title={notification.title}
            withCloseButton={notification.dismissible !== false}
            onClose={() => dismissNotification(notification.id)}
            styles={{
              root: {
                borderRadius: 0,
              },
              message: {
                color: 'inherit',
              },
            }}
          >
            <Group justify="space-between" align="center" wrap="nowrap">
              <Text size="sm" inherit>
                {notification.message}
              </Text>
              {notification.action && (
                <Box>
                  {notification.action.href ? (
                    <Anchor
                      href={notification.action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      c="white"
                      fw={600}
                      size="sm"
                      underline="always"
                    >
                      {notification.action.label}
                    </Anchor>
                  ) : (
                    <Button
                      variant="white"
                      color={config.color}
                      size="compact-sm"
                      onClick={notification.action.onClick}
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </Box>
              )}
            </Group>
          </Alert>
        );
      })}
    </Stack>
  );
};

export default SystemNotificationBanner;

'use client';

import { useCallback, useState } from 'react';

import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Tabs,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconBellOff,
  IconChecks,
  IconRefresh,
  IconSettings,
} from '@tabler/icons-react';

import { ErrorAlert, PageHeader } from '@/components';
import type { NotificationDto } from '@/types';
import { useNotifications } from '@/lib/hooks/useApi';
import { PATH_DASHBOARD } from '@/routes';

import { NotificationItem } from './components/NotificationItem';

type FilterType = 'all' | 'unread' | 'mentions' | 'comments' | 'updates';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Notifications', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

function Notifications() {
  const [filter, setFilter] = useState<FilterType>('all');

  const {
    data: notificationsData,
    loading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useNotifications();

  const handleMarkAsRead = useCallback((id: string) => {
    console.log('Mark as read:', id);
    // In a real app, send PATCH request
  }, []);

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read');
    // In a real app, send PATCH request
  };

  const filteredNotifications = notificationsData?.data?.filter(
    (notification: NotificationDto) => {
      if (filter === 'unread') return !notification.read;
      if (filter === 'mentions') return notification.type === 'mention';
      if (filter === 'comments') return notification.type === 'comment';
      if (filter === 'updates') return notification.type === 'update';
      return true;
    }
  );

  const unreadCount = notificationsData?.data?.filter(
    (n: NotificationDto) => !n.read
  ).length || 0;

  // Group notifications by date
  const groupedNotifications = filteredNotifications?.reduce((groups: any, notification: NotificationDto) => {
    const date = new Date(notification.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey: string;
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday';
    } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      groupKey = 'This Week';
    } else {
      groupKey = 'Older';
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
    return groups;
  }, {});

  const renderContent = () => {
    if (notificationsLoading) {
      return (
        <Stack gap="xs">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={`notif-loading-${i}`} height={80} radius="md" />
          ))}
        </Stack>
      );
    }

    if (notificationsError) {
      return (
        <Box p="xl">
          <ErrorAlert
            title="Error loading notifications"
            message={notificationsError?.message || 'Failed to load notifications'}
          />
        </Box>
      );
    }

    if (!filteredNotifications?.length) {
      return (
        <Box p="xl">
          <Stack align="center" gap="md">
            <IconBellOff size={64} color="gray" opacity={0.3} />
            <div style={{ textAlign: 'center' }}>
              <Title order={4} c="dimmed">
                No notifications
              </Title>
              <Text size="sm" c="dimmed">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : 'Check back later for updates'}
              </Text>
            </div>
          </Stack>
        </Box>
      );
    }

    return (
      <Stack gap="xl">
        {Object.entries(groupedNotifications || {}).map(([groupKey, notifications]: [string, any]) => (
          <div key={groupKey}>
            <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="sm" px="md">
              {groupKey}
            </Text>
            <Stack gap={2}>
              {notifications.map((notification: NotificationDto) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </Stack>
          </div>
        ))}
      </Stack>
    );
  };

  return (
    <>
      <title>Notifications | DesignSparx</title>
      <meta name="description" content="View and manage your notifications" />

      <PageHeader
        title="Notifications"
        breadcrumbItems={items}
        actionButton={
          <Group gap="sm">
            <Tooltip label="Refresh">
              <ActionIcon variant="subtle" onClick={() => refetchNotifications()}>
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Settings">
              <ActionIcon variant="subtle">
                <IconSettings size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        }
      />

      <Box mt="md">
        <Paper withBorder radius="md">
          <Tabs value={filter} onChange={(value) => setFilter(value as FilterType)}>
            <Box px="md" pt="md">
              <Group justify="space-between" mb="xs">
                <Tabs.List>
                  <Tabs.Tab value="all">
                    <Group gap={6}>
                      All
                      {notificationsData?.data && notificationsData?.data?.length > 0 && (
                        <Badge size="sm">
                          {notificationsData.data.length}
                        </Badge>
                      )}
                    </Group>
                  </Tabs.Tab>
                  <Tabs.Tab value="unread">
                    <Group gap={6}>
                      Unread
                      {unreadCount > 0 && (
                        <Badge size="sm">
                          {unreadCount}
                        </Badge>
                      )}
                    </Group>
                  </Tabs.Tab>
                  <Tabs.Tab value="mentions">Mentions</Tabs.Tab>
                  <Tabs.Tab value="comments">Comments</Tabs.Tab>
                  <Tabs.Tab value="updates">Updates</Tabs.Tab>
                </Tabs.List>

                {unreadCount > 0 && (
                  <Tooltip label="Mark all as read">
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconChecks size={14} />}
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  </Tooltip>
                )}
              </Group>
            </Box>

            <Tabs.Panel value={filter} pt="md">
              <Box px="md" pb="md">
                <ScrollArea style={{ maxHeight: 'calc(100vh - 320px)' }}>
                  {renderContent()}
                </ScrollArea>
              </Box>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Box>
    </>
  );
}

export default Notifications;

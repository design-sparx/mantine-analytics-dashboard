import { Timeline, Text, Badge, Group, Skeleton, Stack, Avatar } from '@mantine/core';
import {
  IconPhone,
  IconMail,
  IconUsers,
  IconChecklist,
} from '@tabler/icons-react';
import { ErrorAlert } from '@/components';

interface Activity {
  id: number;
  type: string;
  company: string;
  contact: string;
  description: string;
  assignedTo: string;
  timestamp: string;
  status: string;
}

interface ActivitiesTimelineProps {
  data?: Activity[];
  loading?: boolean;
  error?: Error | null;
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, any> = {
    call: IconPhone,
    email: IconMail,
    meeting: IconUsers,
    task: IconChecklist,
  };
  return icons[type] || IconChecklist;
};

const getActivityColor = (type: string) => {
  const colors: Record<string, string> = {
    call: 'blue',
    email: 'violet',
    meeting: 'teal',
    task: 'orange',
  };
  return colors[type] || 'gray';
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    completed: 'teal',
    scheduled: 'blue',
    pending: 'orange',
  };
  return colors[status] || 'gray';
};

export const ActivitiesTimeline: React.FC<ActivitiesTimelineProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading activities"
        message={error.message || 'Failed to load activities'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`activity-loading-${i}`} height={80} radius="sm" />
        ))}
      </Stack>
    );
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Timeline active={data.length} bulletSize={32} lineWidth={2}>
      {data.map((activity) => {
        const Icon = getActivityIcon(activity.type);
        return (
          <Timeline.Item
            key={activity.id}
            bullet={<Icon size={16} />}
            color={getActivityColor(activity.type)}
            title={
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  {activity.company}
                </Text>
                <Badge size="sm" variant="light" color={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
              </Group>
            }
          >
            <Text size="xs" c="dimmed" mb={4}>
              {activity.contact}
            </Text>
            <Text size="sm" mb={8}>
              {activity.description}
            </Text>
            <Group gap="xs" mt="xs">
              <Avatar size={20} radius="xl" color="blue">
                {activity.assignedTo
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Avatar>
              <Text size="xs" c="dimmed">
                {activity.assignedTo} • {formatTime(activity.timestamp)}
              </Text>
            </Group>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};

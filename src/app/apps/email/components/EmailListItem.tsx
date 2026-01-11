import {
  Avatar,
  Badge,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconPaperclip,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';

import type { EmailDto } from '@/types';

interface EmailListItemProps extends Omit<PaperProps, 'children'> {
  email: EmailDto;
  active?: boolean;
  onClick?: () => void;
  onToggleStar?: (email: EmailDto) => void;
}

export const EmailListItem = ({
  email,
  active = false,
  onClick,
  onToggleStar,
  ...paperProps
}: EmailListItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStar?.(email);
  };

  return (
    <Paper
      p="md"
      withBorder
      style={{
        cursor: 'pointer',
        backgroundColor: active
          ? 'var(--mantine-primary-color-light)'
          : email.read
            ? 'transparent'
            : 'transparent',
      }}
      onClick={onClick}
      {...paperProps}
    >
      <Group justify="space-between" wrap="nowrap" gap="sm">
        <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
          <Avatar
            src={email.from.avatar}
            alt={email.from.name}
            radius="xl"
            size="md"
          />
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Group gap="xs" justify="space-between" wrap="nowrap">
              <Text
                size="sm"
                fw={email.read ? 400 : 700}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {email.from.name}
              </Text>
              <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                {formatDate(email.date)}
              </Text>
            </Group>
            <Text
              size="sm"
              fw={email.read ? 400 : 600}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {email.subject}
            </Text>
            <Text
              size="xs"
              c="dimmed"
              lineClamp={1}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {email.body}
            </Text>
            <Group gap={4} mt={4}>
              {email.important && (
                <Badge size="xs" color="red" variant="light">
                  Important
                </Badge>
              )}
              {email.attachments && email.attachments.length > 0 && (
                <Group gap={4}>
                  <IconPaperclip size={12} />
                  <Text size="xs" c="dimmed">
                    {email.attachments.length}
                  </Text>
                </Group>
              )}
            </Group>
          </Stack>
        </Group>
        <div onClick={handleStarClick} style={{ cursor: 'pointer' }}>
          {email.starred ? (
            <IconStarFilled size={18} color="gold" />
          ) : (
            <IconStar size={18} color="gray" />
          )}
        </div>
      </Group>
    </Paper>
  );
};

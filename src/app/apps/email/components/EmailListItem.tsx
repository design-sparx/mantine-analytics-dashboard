import {
  Avatar,
  Badge,
  Box,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  IconPaperclip,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';

import type { EmailDto } from '@/types';

interface EmailListItemProps {
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
    <UnstyledButton
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px 16px',
        borderBottom: '1px solid var(--mantine-color-gray-2)',
        backgroundColor: active
          ? 'var(--mantine-color-blue-0)'
          : email.read
          ? 'transparent'
          : 'var(--mantine-color-gray-0)',
        transition: 'background-color 100ms ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = email.read
            ? 'transparent'
            : 'var(--mantine-color-gray-0)';
        }
      }}
    >
      <Group wrap="nowrap" gap="sm" align="flex-start">
        <Avatar
          src={email.from.avatar}
          alt={email.from.name}
          radius="xl"
          size={32}
        />

        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" wrap="nowrap" gap="xs">
            <Text
              size="sm"
              fw={email.read ? 500 : 700}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {email.from.name}
            </Text>
            <Text
              size="xs"
              c="dimmed"
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
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

          <Group gap={6} mt={2}>
            {email.important && (
              <Badge size="xs" color="red" variant="dot">
                Important
              </Badge>
            )}
            {email.attachments && email.attachments.length > 0 && (
              <Group gap={2}>
                <IconPaperclip size={12} color="gray" />
                <Text size="xs" c="dimmed">
                  {email.attachments.length}
                </Text>
              </Group>
            )}
            {email.labels?.slice(0, 2).map((label) => (
              <Badge key={label} size="xs" variant="outline">
                {label}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Box onClick={handleStarClick} style={{ cursor: 'pointer', padding: 4 }}>
          {email.starred ? (
            <IconStarFilled size={16} color="gold" />
          ) : (
            <IconStar size={16} color="gray" style={{ opacity: 0.5 }} />
          )}
        </Box>
      </Group>
    </UnstyledButton>
  );
};

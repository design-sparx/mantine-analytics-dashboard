import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconArrowBack,
  IconPaperclip,
  IconMessageReply,
  IconStar,
  IconStarFilled,
  IconTrash,
} from '@tabler/icons-react';

import type { EmailDto } from '@/types';

interface EmailDetailProps {
  email: EmailDto | null;
  onBack?: () => void;
  onReply?: (email: EmailDto) => void;
  onDelete?: (email: EmailDto) => void;
  onToggleStar?: (email: EmailDto) => void;
}

export const EmailDetail = ({
  email,
  onBack,
  onReply,
  onDelete,
  onToggleStar,
}: EmailDetailProps) => {
  if (!email) {
    return (
      <Paper p="xl" withBorder style={{ height: '100%' }}>
        <Stack align="center" justify="center" style={{ height: '100%' }}>
          <Text c="dimmed">Select an email to view</Text>
        </Stack>
      </Paper>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Paper p="md" withBorder style={{ height: '100%', overflow: 'auto' }}>
      <Stack gap="md">
        <Group justify="space-between">
          <Group>
            <ActionIcon variant="subtle" onClick={onBack}>
              <IconArrowBack size={18} />
            </ActionIcon>
          </Group>
          <Group gap="xs">
            <Tooltip label={email.starred ? 'Unstar' : 'Star'}>
              <ActionIcon
                variant="subtle"
                onClick={() => onToggleStar?.(email)}
              >
                {email.starred ? (
                  <IconStarFilled size={18} color="gold" />
                ) : (
                  <IconStar size={18} />
                )}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Reply">
              <ActionIcon variant="subtle" onClick={() => onReply?.(email)}>
                <IconMessageReply size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => onDelete?.(email)}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <div>
          <Title order={3} mb="xs">
            {email.subject}
          </Title>
          <Group gap={4} mb="sm">
            {email.important && (
              <Badge size="sm" color="red" variant="light">
                Important
              </Badge>
            )}
            {email.labels?.map((label) => (
              <Badge key={label} size="sm" variant="dot">
                {label}
              </Badge>
            ))}
          </Group>
        </div>

        <Divider />

        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <Avatar
              src={email.from.avatar}
              alt={email.from.name}
              radius="xl"
              size="lg"
            />
            <Stack gap={2}>
              <Text fw={600}>{email.from.name}</Text>
              <Text size="sm" c="dimmed">
                {email.from.email}
              </Text>
              <Text size="xs" c="dimmed">
                to: {email.to.join(', ')}
              </Text>
              {email.cc && email.cc.length > 0 && (
                <Text size="xs" c="dimmed">
                  cc: {email.cc.join(', ')}
                </Text>
              )}
            </Stack>
          </Group>
          <Text size="xs" c="dimmed">
            {formatDate(email.date)}
          </Text>
        </Group>

        <Divider />

        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {email.body}
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <>
            <Divider />
            <Stack gap="xs">
              <Group gap="xs">
                <IconPaperclip size={16} />
                <Text size="sm" fw={500}>
                  Attachments ({email.attachments.length})
                </Text>
              </Group>
              {email.attachments.map((attachment) => (
                <Paper key={attachment.id} p="sm" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text size="sm" fw={500}>
                        {attachment.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {formatFileSize(attachment.size)}
                      </Text>
                    </div>
                    <Button variant="subtle" size="xs">
                      Download
                    </Button>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </>
        )}

        <Divider />

        <Group>
          <Button
            leftSection={<IconMessageReply size={16} />}
            onClick={() => onReply?.(email)}
          >
            Reply
          </Button>
          <Button variant="outline">Forward</Button>
        </Group>
      </Stack>
    </Paper>
  );
};

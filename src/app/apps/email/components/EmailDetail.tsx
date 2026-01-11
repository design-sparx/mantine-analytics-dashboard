import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconArchive,
  IconDownload,
  IconMessageReply,
  IconPaperclip,
  IconPrinter,
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
      <Box
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--mantine-color-gray-0)',
        }}
      >
        <Stack align="center" gap="md">
          <Title order={3} c="dimmed">Select a message</Title>
          <Text size="sm" c="dimmed">
            Choose an email from the list to view its contents
          </Text>
        </Stack>
      </Box>
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
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Toolbar */}
      <Box
        p="md"
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          backgroundColor: 'white',
        }}
      >
        <Group justify="space-between">
          <Group gap="xs">
            <Tooltip label={email.starred ? 'Unstar' : 'Star'}>
              <ActionIcon
                variant="subtle"
                onClick={() => onToggleStar?.(email)}
                size="lg"
              >
                {email.starred ? (
                  <IconStarFilled size={18} color="gold" />
                ) : (
                  <IconStar size={18} />
                )}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Archive">
              <ActionIcon variant="subtle" size="lg">
                <IconArchive size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => onDelete?.(email)}
                size="lg"
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group gap="xs">
            <Tooltip label="Print">
              <ActionIcon variant="subtle" size="lg">
                <IconPrinter size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Box>

      {/* Email Content */}
      <ScrollArea style={{ flex: 1 }}>
        <Box p="xl">
          <Stack gap="lg">
            {/* Subject */}
            <div>
              <Title order={2} mb="xs">
                {email.subject}
              </Title>
              <Group gap={6}>
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

            {/* Sender Info */}
            <Group justify="space-between" align="flex-start">
              <Group gap="md">
                <Avatar
                  src={email.from.avatar}
                  alt={email.from.name}
                  radius="xl"
                  size={48}
                />
                <Stack gap={2}>
                  <Text fw={600} size="sm">{email.from.name}</Text>
                  <Text size="xs" c="dimmed">
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
              <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                {formatDate(email.date)}
              </Text>
            </Group>

            {/* Email Body */}
            <Box
              style={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.7,
                fontSize: '14px',
                color: 'var(--mantine-color-gray-9)',
              }}
            >
              {email.body}
            </Box>

            {/* Attachments */}
            {email.attachments && email.attachments.length > 0 && (
              <>
                <Divider />
                <Stack gap="sm">
                  <Group gap="xs">
                    <IconPaperclip size={18} color="gray" />
                    <Text size="sm" fw={500}>
                      {email.attachments.length} Attachment
                      {email.attachments.length > 1 ? 's' : ''}
                    </Text>
                  </Group>
                  <Group gap="sm">
                    {email.attachments.map((attachment) => (
                      <Paper
                        key={attachment.id}
                        p="md"
                        withBorder
                        style={{ width: 200 }}
                      >
                        <Stack gap="xs">
                          <IconPaperclip size={24} color="gray" />
                          <div>
                            <Text
                              size="sm"
                              fw={500}
                              lineClamp={1}
                              title={attachment.name}
                            >
                              {attachment.name}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {formatFileSize(attachment.size)}
                            </Text>
                          </div>
                          <Button
                            variant="light"
                            size="xs"
                            leftSection={<IconDownload size={14} />}
                            fullWidth
                          >
                            Download
                          </Button>
                        </Stack>
                      </Paper>
                    ))}
                  </Group>
                </Stack>
              </>
            )}

            {/* Action Buttons */}
            <Group mt="md">
              <Button
                leftSection={<IconMessageReply size={18} />}
                onClick={() => onReply?.(email)}
                variant="filled"
              >
                Reply
              </Button>
              <Button variant="outline">Reply All</Button>
              <Button variant="outline">Forward</Button>
            </Group>
          </Stack>
        </Box>
      </ScrollArea>
    </Box>
  );
};

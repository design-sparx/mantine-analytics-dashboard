'use client';

import { useCallback, useState } from 'react';

import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import {
  IconArchive,
  IconInbox,
  IconMoodEmpty,
  IconPencil,
  IconRefresh,
  IconSearch,
  IconSend,
  IconSettings,
  IconStar,
  IconTrash,
} from '@tabler/icons-react';

import { ErrorAlert, PageHeader } from '@/components';
import type { EmailDto } from '@/types';
import { useEmails } from '@/lib/hooks/useApi';
import { PATH_DASHBOARD } from '@/routes';

import { ComposeEmail } from './components/ComposeEmail';
import { EmailDetail } from './components/EmailDetail';
import { EmailListItem } from './components/EmailListItem';

type EmailFilter = 'inbox' | 'starred' | 'sent' | 'trash';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Email', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

function Email() {
  const [selectedEmail, setSelectedEmail] = useState<EmailDto | null>(null);
  const [filter, setFilter] = useState<EmailFilter>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);

  const {
    data: emailsData,
    loading: emailsLoading,
    error: emailsError,
    refetch: refetchEmails,
  } = useEmails();

  const [composeOpened, { open: composeOpen, close: composeClose }] =
    useDisclosure(false);

  const handleEmailSent = useCallback(() => {
    refetchEmails();
  }, [refetchEmails]);

  const handleReply = (email: EmailDto) => {
    composeOpen();
  };

  const handleDelete = (email: EmailDto) => {
    console.log('Delete email:', email.id);
  };

  const handleToggleStar = (email: EmailDto) => {
    console.log('Toggle star:', email.id);
  };

  const filteredEmails = emailsData?.data?.filter((email: EmailDto) => {
    if (filter === 'inbox' && email.folder !== 'inbox') return false;
    if (filter === 'starred' && !email.starred) return false;
    if (filter === 'sent' && email.folder !== 'sent') return false;
    if (filter === 'trash' && email.folder !== 'trash') return false;

    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      return (
        email.subject.toLowerCase().includes(query) ||
        email.from.name.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const unreadCount = emailsData?.data?.filter(
    (e: EmailDto) => e.folder === 'inbox' && !e.read
  ).length || 0;

  const renderEmailList = () => {
    if (emailsLoading) {
      return (
        <Stack gap={0}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={`email-loading-${i}`} height={80} radius={0} />
          ))}
        </Stack>
      );
    }

    if (emailsError) {
      return (
        <Box p="xl">
          <ErrorAlert
            title="Error loading emails"
            message={emailsError?.message || 'Failed to load emails'}
          />
        </Box>
      );
    }

    if (!filteredEmails?.length) {
      return (
        <Box p="xl">
          <Stack align="center" gap="md">
            <IconMoodEmpty size={64} color="gray" opacity={0.3} />
            <div style={{ textAlign: 'center' }}>
              <Title order={4} c="dimmed">No emails found</Title>
              <Text size="sm" c="dimmed">
                {debouncedQuery
                  ? 'Try adjusting your search'
                  : 'Your mailbox is empty'}
              </Text>
            </div>
          </Stack>
        </Box>
      );
    }

    return (
      <Stack gap={0}>
        {filteredEmails.map((email: EmailDto) => (
          <EmailListItem
            key={email.id}
            email={email}
            active={selectedEmail?.id === email.id}
            onClick={() => setSelectedEmail(email)}
            onToggleStar={handleToggleStar}
          />
        ))}
      </Stack>
    );
  };

  return (
    <>
      <title>Email | DesignSparx</title>
      <meta name="description" content="Manage your emails" />

      <PageHeader
        title="Email"
        breadcrumbItems={items}
        actionButton={
          <Group gap="sm">
            <Tooltip label="Refresh">
              <ActionIcon variant="subtle" onClick={() => refetchEmails()}>
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

      <Box mt="md" style={{ display: 'flex', gap: 0, height: 'calc(100vh - 200px)' }}>
        {/* Left Sidebar - Folders */}
        <Paper
          withBorder
          style={{
            width: 240,
            borderRadius: 0,
            borderRight: '1px solid var(--mantine-color-gray-3)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box p="md">
            <Button
              leftSection={<IconPencil size={18} />}
              onClick={composeOpen}
              fullWidth
              size="md"
            >
              New message
            </Button>
          </Box>

          <Divider />

          <ScrollArea style={{ flex: 1 }}>
            <Stack gap={2} p="xs">
              <Button
                variant={filter === 'inbox' ? 'light' : 'subtle'}
                leftSection={<IconInbox size={18} />}
                justify="flex-start"
                onClick={() => setFilter('inbox')}
                fullWidth
                rightSection={
                  unreadCount > 0 && (
                    <Badge size="sm" circle>
                      {unreadCount}
                    </Badge>
                  )
                }
              >
                Inbox
              </Button>

              <Button
                variant={filter === 'starred' ? 'light' : 'subtle'}
                leftSection={<IconStar size={18} />}
                justify="flex-start"
                onClick={() => setFilter('starred')}
                fullWidth
              >
                Starred
              </Button>

              <Button
                variant={filter === 'sent' ? 'light' : 'subtle'}
                leftSection={<IconSend size={18} />}
                justify="flex-start"
                onClick={() => setFilter('sent')}
                fullWidth
              >
                Sent
              </Button>

              <Button
                variant="subtle"
                leftSection={<IconArchive size={18} />}
                justify="flex-start"
                fullWidth
                disabled
              >
                Archive
              </Button>

              <Button
                variant={filter === 'trash' ? 'light' : 'subtle'}
                leftSection={<IconTrash size={18} />}
                justify="flex-start"
                onClick={() => setFilter('trash')}
                fullWidth
              >
                Trash
              </Button>
            </Stack>
          </ScrollArea>
        </Paper>

        {/* Middle - Email List */}
        <Paper
          withBorder
          style={{
            width: 380,
            borderRadius: 0,
            borderRight: '1px solid var(--mantine-color-gray-3)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box p="md">
            <TextInput
              placeholder="Search in mail..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              size="sm"
            />
          </Box>

          <Divider />

          <Box style={{ flex: 1, position: 'relative' }}>
            <ScrollArea style={{ position: 'absolute', inset: 0 }}>
              {renderEmailList()}
            </ScrollArea>
          </Box>
        </Paper>

        {/* Right - Email Detail */}
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <EmailDetail
            email={selectedEmail}
            onBack={() => setSelectedEmail(null)}
            onReply={handleReply}
            onDelete={handleDelete}
            onToggleStar={handleToggleStar}
          />
        </Box>
      </Box>

      <ComposeEmail
        opened={composeOpened}
        onClose={composeClose}
        position="right"
        onEmailSent={handleEmailSent}
        replyTo={
          selectedEmail
            ? {
                to: selectedEmail.from.email,
                subject: selectedEmail.subject,
              }
            : undefined
        }
      />
    </>
  );
}

export default Email;

'use client';

import { useCallback, useState } from 'react';

import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Grid,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import {
  IconInbox,
  IconMoodEmpty,
  IconPencil,
  IconRefresh,
  IconSearch,
  IconSend,
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
    // In a real app, this would pre-fill the compose form
    composeOpen();
  };

  const handleDelete = (email: EmailDto) => {
    // In a real app, this would send a DELETE request
    console.log('Delete email:', email.id);
  };

  const handleToggleStar = (email: EmailDto) => {
    // In a real app, this would send a PATCH request
    console.log('Toggle star:', email.id);
  };

  const filteredEmails = emailsData?.data?.filter((email: EmailDto) => {
    // Filter by folder
    if (filter === 'inbox' && email.folder !== 'inbox') return false;
    if (filter === 'starred' && !email.starred) return false;
    if (filter === 'sent' && email.folder !== 'sent') return false;
    if (filter === 'trash' && email.folder !== 'trash') return false;

    // Filter by search query
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

  const renderEmailList = () => {
    if (emailsLoading) {
      return (
        <Stack gap="xs">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`email-loading-${i}`} height={100} />
          ))}
        </Stack>
      );
    }

    if (emailsError) {
      return (
        <ErrorAlert
          title="Error loading emails"
          message={emailsError?.message || 'Failed to load emails'}
        />
      );
    }

    if (!filteredEmails?.length) {
      return (
        <Paper p="xl" withBorder>
          <Stack align="center">
            <IconMoodEmpty size={48} color="gray" />
            <Title order={4}>No emails found</Title>
            <Text c="dimmed">
              {debouncedQuery
                ? 'Try adjusting your search'
                : 'Your mailbox is empty'}
            </Text>
          </Stack>
        </Paper>
      );
    }

    return (
      <Stack gap="xs">
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
      <>
        <title>Email | DesignSparx</title>
        <meta name="description" content="Manage your emails" />
      </>
      <PageHeader
        title="Email"
        breadcrumbItems={items}
        actionButton={
          <Group gap="sm">
            <ActionIcon variant="subtle" onClick={() => refetchEmails()}>
              <IconRefresh size={18} />
            </ActionIcon>
            <Button
              leftSection={<IconPencil size={18} />}
              onClick={composeOpen}
            >
              Compose
            </Button>
          </Group>
        }
      />

      <Grid gutter="md" mt="md">
        <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
          <Paper p="md" withBorder>
            <Stack>
              <Button
                leftSection={<IconPencil size={18} />}
                onClick={composeOpen}
                fullWidth
              >
                Compose
              </Button>

              <Stack gap="xs">
                <Button
                  variant={filter === 'inbox' ? 'light' : 'subtle'}
                  leftSection={<IconInbox size={18} />}
                  justify="flex-start"
                  onClick={() => setFilter('inbox')}
                  fullWidth
                  rightSection={
                    emailsData?.data?.length &&
                    emailsData?.data?.filter(
                      (e: EmailDto) => e.folder === 'inbox' && !e.read,
                    ).length > 0 && (
                      <Badge ml="auto">
                        {
                          emailsData?.data?.filter(
                            (e: EmailDto) => e.folder === 'inbox' && !e.read,
                          ).length
                        }
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
                  variant={filter === 'trash' ? 'light' : 'subtle'}
                  leftSection={<IconTrash size={18} />}
                  justify="flex-start"
                  onClick={() => setFilter('trash')}
                  fullWidth
                >
                  Trash
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8, lg: 4 }}>
          <Stack>
            <TextInput
              placeholder="Search emails..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
            {renderEmailList()}
          </Stack>
        </Grid.Col>

        {selectedEmail && (
          <Grid.Col span={{ base: 12, lg: 5 }} visibleFrom="lg">
            <EmailDetail
              email={selectedEmail}
              onBack={() => setSelectedEmail(null)}
              onReply={handleReply}
              onDelete={handleDelete}
              onToggleStar={handleToggleStar}
            />
          </Grid.Col>
        )}
      </Grid>

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

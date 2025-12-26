'use client';

import {
  Alert,
  Anchor,
  Badge,
  Box,
  Card,
  Container,
  Divider,
  Group,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  Title,
  rem,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconArrowRight,
  IconBrandGithub,
  IconBulb,
  IconCheck,
  IconCircleCheck,
  IconExternalLink,
  IconGitBranch,
  IconInfoCircle,
  IconSpeakerphone,
  IconRocket,
  IconVersions,
} from '@tabler/icons-react';

// Announcement data - could be moved to a separate file or fetched from API
const announcements = [
  {
    id: 'next-16-migration',
    date: 'November 2024',
    type: 'major',
    title: 'Upgraded to Next.js 16',
    description:
      'We have migrated the dashboard template from Next.js 14 to Next.js 16, bringing improved performance, new features, and better developer experience.',
    highlights: [
      'Enhanced performance with improved bundling',
      'New React 19 features support',
      'Improved server components',
      'Better error handling and debugging',
    ],
    action: {
      label: 'View Migration PR',
      href: 'https://github.com/design-sparx/mantine-analytics-dashboard/pulls',
    },
  },
  {
    id: 'next-14-branch',
    date: 'November 2024',
    type: 'info',
    title: 'Next.js 14 Branch Available',
    description:
      'For users who need backwards compatibility or prefer the stable version, the previous Next.js 14 version is available on a dedicated branch.',
    highlights: [
      'Full feature parity with previous release',
      'Continues to receive critical bug fixes',
      'Ideal for production apps requiring stability',
      'Easy to switch between versions',
    ],
    action: {
      label: 'View next-14 Branch',
      href: 'https://github.com/design-sparx/mantine-analytics-dashboard/tree/next-14',
    },
  },
  {
    id: 'api-integration',
    date: 'October 2024',
    type: 'feature',
    title: 'Type-Safe API Integration with RBAC',
    description:
      'New type-safe API integration system with Role-Based Access Control (RBAC) is now available. Generate TypeScript types from OpenAPI specs automatically.',
    highlights: [
      'Auto-generated TypeScript types from OpenAPI spec',
      'Permission-based access control with React components',
      'Zero-boilerplate API calls with Mantine hooks',
      'Automatic data refreshing after mutations',
    ],
    action: {
      label: 'Read Documentation',
      href: 'https://github.com/design-sparx/mantine-analytics-dashboard/discussions/69',
    },
  },
  {
    id: 'real-time-apis',
    date: 'October 2024',
    type: 'ongoing',
    title: 'Moving to Real-Time APIs',
    description:
      'We are progressively moving away from mock data to real-time APIs for a more realistic development experience.',
    highlights: [
      'Real API endpoints replacing mock data',
      'Better demonstration of API integration patterns',
      'More realistic data flow examples',
      'Improved testing scenarios',
    ],
    action: {
      label: 'View API Roadmap',
      href: 'https://github.com/orgs/design-sparx/projects/6/views/1?filterQuery=&layout=roadmap',
    },
  },
];

const getAnnouncementBadge = (type: string) => {
  switch (type) {
    case 'major':
      return { color: 'blue', label: 'Major Release' };
    case 'feature':
      return { color: 'green', label: 'New Feature' };
    case 'info':
      return { color: 'cyan', label: 'Information' };
    case 'ongoing':
      return { color: 'orange', label: 'In Progress' };
    case 'deprecated':
      return { color: 'red', label: 'Deprecated' };
    default:
      return { color: 'gray', label: 'Update' };
  }
};

const getAnnouncementIcon = (type: string) => {
  switch (type) {
    case 'major':
      return <IconRocket size={20} />;
    case 'feature':
      return <IconCircleCheck size={20} />;
    case 'info':
      return <IconInfoCircle size={20} />;
    case 'ongoing':
      return <IconBulb size={20} />;
    case 'deprecated':
      return <IconAlertTriangle size={20} />;
    default:
      return <IconSpeakerphone size={20} />;
  }
};

export default function AnnouncementsPage() {
  return (
    <Container size="lg" py={rem(80)}>
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Group align="center" gap="md" mb="md">
            <ThemeIcon
              size="xl"
              variant="filled"
              color="blue"
              className="surface-elevated"
            >
              <IconSpeakerphone size={24} />
            </ThemeIcon>
            <Title order={1}>Announcements</Title>
          </Group>
          <Text size="lg">
            Stay up to date with the latest updates, releases, and changes to
            the Mantine Analytics Dashboard.
          </Text>
        </Box>

        <Divider />

        {/* Version Quick Links */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          <Card withBorder p="md" className="surface-bordered">
            <Group gap="md" wrap="nowrap">
              <ThemeIcon size="lg" color="blue" variant="light">
                <IconVersions size={20} />
              </ThemeIcon>
              <Box>
                <Text fw={600} size="sm">
                  Current Version
                </Text>
                <Text size="xs">Next.js 16 (main branch)</Text>
              </Box>
            </Group>
          </Card>

          <Card withBorder p="md" className="surface-bordered">
            <Group gap="md" wrap="nowrap">
              <ThemeIcon size="lg" color="cyan" variant="light">
                <IconGitBranch size={20} />
              </ThemeIcon>
              <Box>
                <Text fw={600} size="sm">
                  Stable Version
                </Text>
                <Anchor
                  href="https://github.com/design-sparx/mantine-analytics-dashboard/tree/next-14"
                  target="_blank"
                  size="xs"
                >
                  Next.js 14 (next-14 branch)
                </Anchor>
              </Box>
            </Group>
          </Card>

          <Card withBorder p="md" className="surface-bordered">
            <Group gap="md" wrap="nowrap">
              <ThemeIcon size="lg" color="gray" variant="light">
                <IconBrandGithub size={20} />
              </ThemeIcon>
              <Box>
                <Text fw={600} size="sm">
                  Legacy Version
                </Text>
                <Anchor
                  href="https://github.com/design-sparx/mantine-analytics-dashboard/tree/v1"
                  target="_blank"
                  size="xs"
                >
                  Next.js 13 (v1 branch)
                </Anchor>
              </Box>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Timeline of Announcements */}
        <Timeline active={0} bulletSize={32} lineWidth={2}>
          {announcements.map((announcement) => {
            const badge = getAnnouncementBadge(announcement.type);
            return (
              <Timeline.Item
                key={announcement.id}
                bullet={
                  <ThemeIcon size="md" color={badge.color} variant="filled">
                    {getAnnouncementIcon(announcement.type)}
                  </ThemeIcon>
                }
                title={
                  <Group align="center" gap="md" mb="sm">
                    <Title order={3}>{announcement.title}</Title>
                    <Badge color={badge.color} variant="light" size="sm">
                      {badge.label}
                    </Badge>
                  </Group>
                }
              >
                <Text size="sm" mb="sm">
                  {announcement.date}
                </Text>
                <Paper withBorder p="md" mb="lg" className="surface-elevated">
                  <Stack gap="md">
                    <Text>{announcement.description}</Text>

                    {announcement.highlights.length > 0 && (
                      <Box>
                        <Text fw={600} size="sm" mb="xs">
                          Highlights:
                        </Text>
                        <List
                          size="sm"
                          spacing="xs"
                          icon={
                            <ThemeIcon
                              size="sm"
                              color={badge.color}
                              variant="light"
                            >
                              <IconCheck size={12} />
                            </ThemeIcon>
                          }
                        >
                          {announcement.highlights.map((highlight, i) => (
                            <List.Item key={i}>{highlight}</List.Item>
                          ))}
                        </List>
                      </Box>
                    )}

                    {announcement.action && (
                      <Group>
                        <Anchor
                          href={announcement.action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                        >
                          <Group gap="xs">
                            {announcement.action.label}
                            <IconExternalLink size={14} />
                          </Group>
                        </Anchor>
                      </Group>
                    )}
                  </Stack>
                </Paper>
              </Timeline.Item>
            );
          })}
        </Timeline>

        {/* Migration Guide Alert */}
        <Alert
          icon={<IconInfoCircle size={18} />}
          title="Migrating from Next.js 14?"
          color="blue"
          variant="light"
        >
          <Text size="sm" mb="md">
            If you&apos;re upgrading from the Next.js 14 version, please review
            the migration notes in our documentation. Most changes are
            backwards-compatible, but some adjustments may be needed.
          </Text>
          <Group>
            <Anchor
              href="https://github.com/design-sparx/mantine-analytics-dashboard/pulls"
              target="_blank"
              size="sm"
            >
              <Group gap="xs">
                View Migration PR
                <IconArrowRight size={14} />
              </Group>
            </Anchor>
          </Group>
        </Alert>

        {/* Footer */}
        <Paper withBorder p="md" mt="xl" className="surface-bordered">
          <Group align="center" gap="md">
            <Text size="sm">
              Have questions or suggestions?{' '}
              <Anchor
                href="https://github.com/design-sparx/mantine-analytics-dashboard/discussions"
                target="_blank"
                size="sm"
              >
                Join the discussion on GitHub
              </Anchor>
            </Text>
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
}

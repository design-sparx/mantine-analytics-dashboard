'use client';

import { useEffect, useState } from 'react';

import {
  Alert,
  Anchor,
  Badge,
  Box,
  Center,
  Container,
  Divider,
  Group,
  List,
  Loader,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  Title,
  TypographyStylesProvider,
  rem,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconArrowUp,
  IconBug,
  IconExchange,
  IconGitBranch,
  IconInfoCircle,
  IconPlus,
  IconRocket,
  IconSettings,
  IconStar,
  IconTools,
  IconTrash,
} from '@tabler/icons-react';

import { ChangelogEntry } from '@/lib/changelog';

const getVersionBadgeColor = (type: string) => {
  switch (type) {
    case 'major':
      return 'blue';
    case 'minor':
      return 'orange.8';
    case 'patch':
      return 'green';
    default:
      return 'gray';
  }
};

const getChangeIcon = (type: string) => {
  switch (type) {
    case 'major':
      return <IconRocket size={18} />;
    case 'minor':
      return <IconStar size={18} />;
    case 'patch':
      return <IconTools size={18} />;
    case 'added':
      return <IconPlus size={18} />;
    case 'changed':
      return <IconArrowUp size={18} />;
    case 'fixed':
      return <IconBug size={18} />;
    case 'deprecated':
      return <IconAlertTriangle size={18} />;
    case 'security':
      return <IconSettings size={18} />;
    case 'removed':
      return <IconTrash size={18} />;
    default:
      return <IconGitBranch size={18} />;
  }
};

const getChangeColor = (type: string) => {
  switch (type) {
    case 'major':
      return 'blue';
    case 'minor':
      return 'orange.8';
    case 'patch':
      return 'cyan';
    case 'added':
      return 'green';
    case 'changed':
      return 'blue';
    case 'fixed':
      return 'orange';
    case 'deprecated':
      return 'yellow';
    case 'security':
      return 'violet';
    case 'removed':
      return 'gray';
    default:
      return 'gray';
  }
};

const getChangeLabel = (type: string) => {
  switch (type) {
    case 'major':
      return 'Major Changes';
    case 'minor':
      return 'Minor Changes';
    case 'patch':
      return 'Patch Changes';
    case 'added':
      return 'Added';
    case 'changed':
      return 'Changed';
    case 'fixed':
      return 'Fixed';
    case 'deprecated':
      return 'Deprecated';
    case 'security':
      return 'Security';
    case 'removed':
      return 'Removed';
    default:
      return 'Changes';
  }
};

// Clean up change items by removing markdown and hash prefixes
const cleanChangeItem = (item: string): string => {
  return item
    .replace(/^[a-f0-9]+:\s*/, '') // Remove git hash
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/`(.*?)`/g, '$1') // Remove code markdown
    .replace(/#{1,6}\s*/, '') // Remove heading markdown
    .trim();
};

export default function ClientChangelog() {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/changelog')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setChangelog(data.changelog || []);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch changelog:', err);
        setError('Failed to load changelog');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Center>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertTriangle size={18} />}
          title="Error Loading Changelog"
          color="red"
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!changelog || changelog.length === 0) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconInfoCircle size={18} />}
          title="No Changelog Available"
          color="blue"
        >
          No changelog entries found. Make sure your CHANGELOG.md file exists
          and is properly formatted.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl" mt={rem(80)}>
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
              <IconExchange size={24} />
            </ThemeIcon>
            <Title order={1}>Changelog</Title>
          </Group>
          <Text size="lg">
            Keep track of all changes, improvements and fixes to the Mantine
            Analytics Dashboard.
          </Text>
        </Box>

        <Divider />

        {/* Timeline */}
        <Timeline active={0} bulletSize={24} lineWidth={2}>
          {changelog.map((release, index) => (
            <Timeline.Item
              key={`${release.version}-${index}`}
              bullet={
                <ThemeIcon
                  size="md"
                  color={getVersionBadgeColor(release.type)}
                  variant="filled"
                >
                  <IconGitBranch size={20} />
                </ThemeIcon>
              }
              title={
                <Group align="center" gap="md" mb="sm">
                  <Title order={3}>v{release.version}</Title>
                  <Badge
                    color={getVersionBadgeColor(release.type)}
                    variant="light"
                    size="sm"
                  >
                    {release.type}
                  </Badge>
                  <Text size="sm">{release.date}</Text>
                </Group>
              }
            >
              <Paper withBorder p="md" mb="lg" className="surface-elevated">
                <Stack gap="md">
                  {/* Release Description */}
                  {release.description && (
                    <Box component={TypographyStylesProvider}>
                      <Text fz="lg" fw={600}>
                        {release.description}
                      </Text>
                    </Box>
                  )}

                  {/* Changes */}
                  {release.changes.map((changeGroup, groupIndex) => (
                    <Box key={`${changeGroup.type}-${groupIndex}`}>
                      <Group align="center" gap="xs" mb="sm">
                        <ThemeIcon
                          size="sm"
                          color={getChangeColor(changeGroup.type)}
                          variant="light"
                        >
                          {getChangeIcon(changeGroup.type)}
                        </ThemeIcon>
                        <Text fw={600} size="sm">
                          {changeGroup.title ||
                            getChangeLabel(changeGroup.type)}
                        </Text>
                      </Group>

                      {changeGroup.items.length > 0 && (
                        <List size="sm" spacing="xs" withPadding>
                          {changeGroup.items.map((item, itemIndex) => (
                            <List.Item key={itemIndex}>
                              <Text size="sm" style={{ lineHeight: 1.5 }}>
                                {cleanChangeItem(item)}
                              </Text>
                            </List.Item>
                          ))}
                        </List>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Timeline.Item>
          ))}
        </Timeline>

        {/* Footer */}
        <Paper withBorder p="md" mt="xl" className="surface-bordered">
          <Group align="center" gap="md">
            <Text size="sm">
              Found an issue or want to contribute?{' '}
              <Anchor
                href="https://github.com/design-sparx/mantine-analytics-dashboard/issues"
                target="_blank"
                size="sm"
              >
                Report it on GitHub
              </Anchor>
            </Text>
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
}

'use client';

import { Badge, Group, Paper, Stack, Switch, Text } from '@mantine/core';
import { IconDatabase, IconTestPipe } from '@tabler/icons-react';

import { useDataMode } from '@/contexts/data-mode';

export function DataTab() {
  const { mode, isMockMode, toggleMode } = useDataMode();

  return (
    <Stack gap="md">
      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={4}>
              <Group gap="xs">
                <Text fw={500} size="sm">
                  Data Mode
                </Text>
                <Badge
                  size="sm"
                  variant="light"
                  color={isMockMode ? 'orange' : 'blue'}
                >
                  {mode === 'mock' ? 'Mock' : 'Real API'}
                </Badge>
              </Group>
              <Text size="xs" c="dimmed">
                Toggle between mock data and real API endpoints
              </Text>
            </Stack>
            <Switch
              checked={isMockMode}
              onChange={toggleMode}
              size="md"
              onLabel={
                <IconTestPipe
                  size={16}
                  stroke={2.5}
                  style={{ display: 'block' }}
                />
              }
              offLabel={
                <IconDatabase
                  size={16}
                  stroke={2.5}
                  style={{ display: 'block' }}
                />
              }
            />
          </Group>
        </Stack>
      </Paper>

      <Paper p="md" radius="md" bg="var(--mantine-color-blue-light)">
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            {isMockMode ? 'Mock Mode Active' : 'Real API Mode Active'}
          </Text>
          <Text size="xs" c="dimmed">
            {isMockMode
              ? 'Using mock data for development and testing. No real API calls are made. Perfect for demos, testing, or when the backend is unavailable.'
              : 'Connected to real API endpoints. All data operations will interact with the actual backend server.'}
          </Text>
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="sm">
          <Text size="sm" fw={500}>
            How it works
          </Text>
          <Stack gap="xs">
            <Group gap="xs" align="flex-start">
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Text size="xs" c="dimmed">
                <strong>Mock Mode:</strong> All API requests return predefined
                sample data. Great for testing UI without a backend.
              </Text>
            </Group>
            <Group gap="xs" align="flex-start">
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Text size="xs" c="dimmed">
                <strong>Real API Mode:</strong> Connects to your actual backend
                API endpoints. Requires proper authentication.
              </Text>
            </Group>
            <Group gap="xs" align="flex-start">
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Text size="xs" c="dimmed">
                The setting is saved in localStorage and persists across
                sessions.
              </Text>
            </Group>
            <Group gap="xs" align="flex-start">
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Text size="xs" c="dimmed">
                Switch modes anytime without reloading the page. Changes take
                effect immediately.
              </Text>
            </Group>
          </Stack>
        </Stack>
      </Paper>

      <Paper
        withBorder
        p="md"
        radius="md"
        bg="var(--mantine-color-yellow-light)"
      >
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Note for Developers
          </Text>
          <Text size="xs" c="dimmed">
            To add mock data for new endpoints, create mock handlers in{' '}
            <code>lib/mocks/data/</code> and register them in{' '}
            <code>lib/mocks/registry.ts</code>. The system automatically falls
            back to real API if mock data is not available.
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
}

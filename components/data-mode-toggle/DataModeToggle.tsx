'use client';

import { ActionIcon, Badge, Menu, Stack, Text, Tooltip } from '@mantine/core';
import { IconDatabase, IconTestPipe } from '@tabler/icons-react';

import { useDataMode } from '@/contexts/data-mode';

interface DataModeToggleProps {
  iconSize?: number;
  variant?: 'default' | 'transparent';
  textColor?: string;
}

export function DataModeToggle({
  iconSize = 20,
  variant = 'default',
  textColor,
}: DataModeToggleProps) {
  const { mode, isMockMode, toggleMode } = useDataMode();

  return (
    <Menu shadow="md" width={280}>
      <Menu.Target>
        <Tooltip label={`Data Mode: ${isMockMode ? 'Mock' : 'Real API'}`}>
          <ActionIcon size="lg" variant={variant}>
            {isMockMode ? (
              <IconTestPipe size={iconSize} color={textColor} />
            ) : (
              <IconDatabase size={iconSize} color={textColor} />
            )}
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Stack gap={4}>
            <Text size="xs" fw={600} tt="uppercase">
              Data Mode
            </Text>
            <Badge
              size="sm"
              variant="light"
              color={isMockMode ? 'orange' : 'blue'}
            >
              {mode === 'mock' ? 'Mock Data' : 'Real API'}
            </Badge>
          </Stack>
        </Menu.Label>

        <Menu.Divider />

        <Menu.Item
          leftSection={<IconTestPipe size={16} />}
          onClick={() => {
            if (!isMockMode) toggleMode();
          }}
          bg={isMockMode ? 'var(--mantine-color-orange-light)' : undefined}
          fw={isMockMode ? 600 : undefined}
        >
          <Stack gap={2}>
            <Text size="sm">Mock Data</Text>
            <Text size="xs" c="dimmed">
              Use sample data for testing
            </Text>
          </Stack>
        </Menu.Item>

        <Menu.Item
          leftSection={<IconDatabase size={16} />}
          onClick={() => {
            if (isMockMode) toggleMode();
          }}
          bg={!isMockMode ? 'var(--mantine-color-blue-light)' : undefined}
          fw={!isMockMode ? 600 : undefined}
        >
          <Stack gap={2}>
            <Text size="sm">Real API</Text>
            <Text size="xs" c="dimmed">
              Connect to live backend
            </Text>
          </Stack>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>
          <Text size="xs" c="dimmed">
            Switch between mock data and real API endpoints. Changes take effect
            immediately.
          </Text>
        </Menu.Label>
      </Menu.Dropdown>
    </Menu>
  );
}

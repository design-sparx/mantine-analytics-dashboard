import React from 'react';

import {
  Box,
  Button,
  ColorSwatch,
  Divider,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import {
  IconBorderAll,
  IconBorderRadius,
  IconCards,
  IconCircleHalf2,
  IconComponents,
  IconCube,
  IconMoonStars,
  IconPalette,
  IconRectangle,
  IconSunHigh,
  IconZoomIn,
} from '@tabler/icons-react';

import { COLOR_SCHEMES, ThemeConfig } from '@/contexts/theme-customizer';

import { ColorPicker } from '../components/ColorPicker';

interface AppearanceTabProps {
  config: ThemeConfig;
  onConfigUpdate: (path: string[], value: any) => void;
}

export const AppearanceTab = ({
  config,
  onConfigUpdate,
}: AppearanceTabProps) => {
  return (
    <Stack gap="lg">
      {/* Color Scheme */}
      <Paper p="sm" withBorder>
        <Group mb="sm">
          <IconPalette size={20} />
          <Text fw={600}>Color Scheme</Text>
        </Group>

        <Stack gap="md">
          <Box>
            <Text size="sm" fw={500} mb={8}>
              Theme Mode
            </Text>
            <SegmentedControl
              fullWidth
              data={[
                {
                  value: 'light',
                  label: (
                    <Group gap={6}>
                      <IconSunHigh size={16} />
                      <span>Light</span>
                    </Group>
                  ),
                },
                {
                  value: 'dark',
                  label: (
                    <Group gap={6}>
                      <IconMoonStars size={16} />
                      <span>Dark</span>
                    </Group>
                  ),
                },
                {
                  value: 'auto',
                  label: (
                    <Group gap={6}>
                      <IconCircleHalf2 size={16} />
                      <span>Auto</span>
                    </Group>
                  ),
                },
              ]}
              value={config.appearance.colorScheme}
              onChange={(value) =>
                onConfigUpdate(['appearance', 'colorScheme'], value)
              }
            />
          </Box>

          <Box>
            <Text size="sm" fw={500} mb={8}>
              Primary Color
            </Text>
            <ColorPicker
              value={config.appearance.primaryColor}
              onChange={(color) =>
                onConfigUpdate(['appearance', 'primaryColor'], color)
              }
            />
          </Box>
        </Stack>
      </Paper>

      {/* UI Density */}
      <Paper p="sm" withBorder>
        <Group mb="sm">
          <IconZoomIn size={20} />
          <Text fw={600}>UI Density</Text>
        </Group>

        <Stack gap="md">
          <Switch
            label="Compact mode"
            description="Reduce spacing for a more compact interface"
            checked={config.appearance.compact}
            onChange={(e) =>
              onConfigUpdate(['appearance', 'compact'], e.currentTarget.checked)
            }
          />
        </Stack>
      </Paper>

      {/* Border Radius */}
      <Paper p="sm" withBorder>
        <Group mb="sm">
          <IconBorderRadius size={20} />
          <Text fw={600}>Border Radius</Text>
        </Group>

        <Stack gap="md">
          <Box>
            <Text size="sm" fw={500} mb={8}>
              Corner Roundness
            </Text>
            <SegmentedControl
              fullWidth
              data={[
                { value: 'xs', label: 'Sharp' },
                { value: 'sm', label: 'Small' },
                { value: 'md', label: 'Medium' },
                { value: 'lg', label: 'Large' },
                { value: 'xl', label: 'Round' },
              ]}
              value={config.appearance.borderRadius}
              onChange={(value) =>
                onConfigUpdate(['appearance', 'borderRadius'], value)
              }
            />
          </Box>
        </Stack>
      </Paper>

      {/* Card Feel */}
      <Paper p="sm" withBorder>
        <Group mb="sm">
          <IconCards size={20} />
          <Text fw={600}>Card Feel</Text>
        </Group>

        <Stack gap="md">
          <Box>
            <Text size="sm" fw={500} mb={8}>
              Card Style
            </Text>
            <SegmentedControl
              fullWidth
              data={[
                {
                  value: 'flat',
                  label: (
                    <Group gap={4}>
                      <IconRectangle size={16} />
                      <span>Flat</span>
                    </Group>
                  ),
                },
                {
                  value: 'elevated',
                  label: (
                    <Group gap={4}>
                      <IconCube size={16} />
                      <span>Elevated</span>
                    </Group>
                  ),
                },
                {
                  value: 'bordered',
                  label: (
                    <Group gap={4}>
                      <IconBorderAll size={16} />
                      <span>Bordered</span>
                    </Group>
                  ),
                },
              ]}
              value={config.appearance.cardFeel}
              onChange={(value) =>
                onConfigUpdate(['appearance', 'cardFeel'], value)
              }
            />
          </Box>

          {/* Card Feel Preview */}
          <Box>
            <Text size="sm" fw={500} mb={8}>
              Preview
            </Text>
            <SimpleGrid cols={3} spacing="xs">
              {['flat', 'bordered', 'elevated'].map((feel) => (
                <Paper
                  key={feel}
                  p="xs"
                  className={`surface-card surface-${feel}`}
                  style={{
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border:
                      feel === 'bordered'
                        ? '1px solid var(--mantine-color-default-border)'
                        : 'none',
                    boxShadow:
                      feel === 'elevated' ? 'var(--shadow-card)' : 'none',
                  }}
                >
                  <Text size="xs" ta="center" c="dimmed">
                    {feel.charAt(0).toUpperCase() + feel.slice(1)}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Box>
        </Stack>
      </Paper>

      {/* Preview Section */}
      <Paper p="sm" withBorder>
        <Group mb="sm">
          <IconComponents size={20} />
          <Text fw={600}>Preview</Text>
        </Group>

        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Current primary color:{' '}
            <ColorSwatch
              color={COLOR_SCHEMES[config.appearance.primaryColor].color}
              size={16}
              style={{ display: 'inline-block' }}
            />{' '}
            {COLOR_SCHEMES[config.appearance.primaryColor].name}
          </Text>

          <Group>
            <Button
              variant="filled"
              size={config.appearance.compact ? 'xs' : 'sm'}
              radius={config.appearance.borderRadius}
            >
              Primary Button
            </Button>
            <Button
              variant="outline"
              size={config.appearance.compact ? 'xs' : 'sm'}
              radius={config.appearance.borderRadius}
            >
              Outline Button
            </Button>
          </Group>

          <Paper
            p={config.appearance.compact ? 'xs' : 'sm'}
            withBorder
            radius={config.appearance.borderRadius}
          >
            <Text size="sm">Sample card content with current settings</Text>
          </Paper>
        </Stack>
      </Paper>

      <Divider />

      <Stack align="center" mt="xl">
        <Text c="dimmed" size="sm">
          More appearance options coming soon
        </Text>
      </Stack>
    </Stack>
  );
};

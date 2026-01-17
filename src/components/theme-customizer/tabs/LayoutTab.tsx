import React from 'react';

import {
  Box,
  Group,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import {
  IconCircle,
  IconLayoutDistributeVertical,
  IconLayoutNavbar,
  IconLayoutSidebar,
  IconRectangle,
  IconSquare,
  IconTextDirectionLtr,
} from '@tabler/icons-react';

import { ThemeConfig } from '@/contexts/theme-customizer';

interface LayoutTabProps {
  config: ThemeConfig;
  onConfigUpdate: (path: string[], value: any) => void;
}

export const LayoutTab = ({ config, onConfigUpdate }: LayoutTabProps) => {
  const sidebarVariantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'colored', label: 'Colored' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'glassmorphism', label: 'Glassmorphism' },
  ];

  const headerVariantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'colored', label: 'Colored' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'glassmorphism', label: 'Glassmorphism' },
  ];

  return (
    <Stack gap="lg">
      {/* Sidebar Configuration */}
      <Paper p="sm" withBorder>
        <Group mb="sm">
          <IconLayoutSidebar size={20} />
          <Text fw={600}>Sidebar</Text>
        </Group>

        <Stack gap="md">
          <Select
            label="Variant"
            data={sidebarVariantOptions}
            value={config.layout.sidebar.variant}
            onChange={(value) =>
              onConfigUpdate(['layout', 'sidebar', 'variant'], value)
            }
          />

          <Stack gap={0}>
            <Text fz="sm" fw={500} mb={4}>
              Position
            </Text>
            <SegmentedControl
              data={[
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
              ]}
              value={config.layout.sidebar.position}
              onChange={(value) =>
                onConfigUpdate(['layout', 'sidebar', 'position'], value)
              }
            />
          </Stack>

          <Box>
            <Text size="sm" fw={500} mb={4}>
              Width
            </Text>
            <SegmentedControl
              data={[
                { value: '250', label: 'Compact' },
                { value: '300', label: 'Default' },
                { value: '350', label: 'Wide' },
              ]}
              value={config.layout.sidebar.width.toString()}
              onChange={(value) =>
                onConfigUpdate(['layout', 'sidebar', 'width'], parseInt(value))
              }
            />
          </Box>

          <Switch
            label="Visible"
            description="Show or hide the sidebar"
            checked={config.layout.sidebar.visible}
            onChange={(e) =>
              onConfigUpdate(
                ['layout', 'sidebar', 'visible'],
                e.currentTarget.checked,
              )
            }
          />

          <Switch
            label="Overlay mode"
            description="Sidebar overlays content instead of pushing it aside"
            checked={config.layout.sidebar.overlay}
            onChange={(e) =>
              onConfigUpdate(
                ['layout', 'sidebar', 'overlay'],
                e.currentTarget.checked,
              )
            }
          />
        </Stack>
      </Paper>

      {/* Header Configuration */}
      <Paper p="sm" withBorder>
        <Group mb="sm">
          <IconLayoutNavbar size={20} />
          <Text fw={600}>Header</Text>
        </Group>

        <Stack gap="md">
          <Select
            label="Variant"
            data={headerVariantOptions}
            value={config.layout.header.variant}
            onChange={(value) =>
              onConfigUpdate(['layout', 'header', 'variant'], value)
            }
          />

          <Select
            label="Position"
            data={[
              { value: 'fixed', label: 'Fixed' },
              { value: 'sticky', label: 'Sticky' },
              { value: 'static', label: 'Static' },
            ]}
            value={config.layout.header.position}
            onChange={(value) =>
              onConfigUpdate(['layout', 'header', 'position'], value)
            }
          />

          <Box>
            <Text size="sm" fw={500} mb={4}>
              Height
            </Text>
            <SegmentedControl
              data={[
                { value: '50', label: 'Small' },
                { value: '60', label: 'Default' },
                { value: '80', label: 'Large' },
              ]}
              value={config.layout.header.height.toString()}
              onChange={(value) =>
                onConfigUpdate(['layout', 'header', 'height'], parseInt(value))
              }
            />
          </Box>

          <Switch
            label="Show shadow"
            checked={config.layout.header.showShadow}
            onChange={(e) =>
              onConfigUpdate(
                ['layout', 'header', 'showShadow'],
                e.currentTarget.checked,
              )
            }
          />
        </Stack>
      </Paper>

      {/* Content Layout Configuration */}
      <Paper p="sm" withBorder>
        <Group mb="sm">
          <IconLayoutDistributeVertical size={20} />
          <Text fw={600}>Content Layout</Text>
        </Group>

        <Stack gap="md">
          <Box>
            <Text size="sm" fw={500} mb={8}>
              Layout Type
            </Text>
            <SegmentedControl
              fullWidth
              data={[
                {
                  value: 'boxed',
                  label: (
                    <Group gap={4}>
                      <IconSquare size={16} />
                      <span>Boxed</span>
                    </Group>
                  ),
                },
                {
                  value: 'full-width',
                  label: (
                    <Group gap={4}>
                      <IconRectangle size={16} />
                      <span>Full Width</span>
                    </Group>
                  ),
                },
                {
                  value: 'centered',
                  label: (
                    <Group gap={4}>
                      <IconCircle size={16} />
                      <span>Centered</span>
                    </Group>
                  ),
                },
              ]}
              value={config.layout.content.layout}
              onChange={(value) =>
                onConfigUpdate(['layout', 'content', 'layout'], value)
              }
            />
          </Box>

          <Box>
            <Text size="sm" fw={500} mb={4}>
              Padding
            </Text>
            <SegmentedControl
              data={[
                { value: 'compact', label: 'Compact' },
                { value: 'comfortable', label: 'Comfortable' },
                { value: 'spacious', label: 'Spacious' },
              ]}
              value={config.layout.content.padding}
              onChange={(value) =>
                onConfigUpdate(['layout', 'content', 'padding'], value)
              }
            />
          </Box>
        </Stack>
      </Paper>

      {/* Layout direction */}
      <Paper p="sm" withBorder>
        <Group mb="sm">
          <IconTextDirectionLtr size={20} />
          <Text fw={600}>Layout Direction</Text>
        </Group>

        <Stack gap="md">
          <Box>
            <Text size="sm" fw={500} mb={4}>
              Direction
            </Text>
            <SegmentedControl
              data={[
                { value: 'ltr', label: 'LTR' },
                { value: 'rtl', label: 'RTL' },
              ]}
              value={config.layout.dir}
              onChange={(value) => onConfigUpdate(['layout', 'dir'], value)}
            />
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};

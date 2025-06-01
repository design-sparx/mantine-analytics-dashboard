'use client';

import React, { useEffect, useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Tabs,
  Text,
} from '@mantine/core';
import {
  IconCircle,
  IconComponents,
  IconDeviceFloppy,
  IconLayout,
  IconLayoutDistributeVertical,
  IconLayoutNavbar,
  IconLayoutSidebar,
  IconPalette,
  IconRectangle,
  IconRefresh,
  IconSquare,
  IconTypography,
  IconX,
} from '@tabler/icons-react';

// Types for theme configuration
type SidebarVariant =
  | 'default'
  | 'transparent'
  | 'colored'
  | 'gradient'
  | 'floating';
type SidebarPosition = 'left' | 'right';
type HeaderVariant =
  | 'default'
  | 'transparent'
  | 'compact'
  | 'expanded'
  | 'floating';
type HeaderPosition = 'fixed' | 'sticky' | 'static';
type ContentLayout = 'boxed' | 'full-width' | 'centered' | 'fluid';

interface ThemeConfig {
  layout: {
    sidebar: {
      variant: SidebarVariant;
      position: SidebarPosition;
      width: number;
      collapsible: boolean;
      overlay: boolean;
    };
    header: {
      variant: HeaderVariant;
      position: HeaderPosition;
      height: number;
      showShadow: boolean;
    };
    content: {
      layout: ContentLayout;
      padding: 'compact' | 'comfortable' | 'spacious';
    };
  };
}

interface ThemeCustomizerProps {
  opened: boolean;
  onClose: () => void;
  onApply: (config: ThemeConfig) => void;
  currentConfig?: ThemeConfig;
}

const defaultConfig: ThemeConfig = {
  layout: {
    sidebar: {
      variant: 'default',
      position: 'left',
      width: 300,
      collapsible: true,
      overlay: false,
    },
    header: {
      variant: 'default',
      position: 'fixed',
      height: 60,
      showShadow: true,
    },
    content: {
      layout: 'full-width',
      padding: 'comfortable',
    },
  },
};

export default function ThemeCustomizer({
  opened,
  onClose,
  onApply,
  currentConfig = defaultConfig,
}: ThemeCustomizerProps) {
  const [config, setConfig] = useState<ThemeConfig>(currentConfig);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setConfig(currentConfig);
  }, [currentConfig]);

  useEffect(() => {
    setHasChanges(JSON.stringify(config) !== JSON.stringify(currentConfig));
  }, [config, currentConfig]);

  const updateConfig = (path: string[], value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      let current: any = newConfig;

      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };

  const handleApply = () => {
    onApply(config);
    setHasChanges(false);
  };

  const handleReset = () => {
    setConfig(currentConfig);
    setHasChanges(false);
  };

  const sidebarVariantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'colored', label: 'Colored' },
    { value: 'gradient', label: 'Gradient' },
  ];

  const headerVariantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'colored', label: 'Colored' },
    { value: 'compact', label: 'Compact' },
    { value: 'expanded', label: 'Expanded' },
  ];

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <IconPalette size={20} />
          <Text fw={600}>Theme Customizer</Text>
          {hasChanges && (
            <Badge size="sm" color="orange">
              Unsaved
            </Badge>
          )}
        </Group>
      }
      position="right"
      size="md"
      padding="md"
      closeButtonProps={{
        icon: <IconX size={16} />,
      }}
    >
      <Stack h="100%" gap={0}>
        <Text fz="sm">
          Explore different styles according to your preferences
        </Text>
        <ScrollArea style={{ flex: 1 }} offsetScrollbars>
          <Tabs defaultValue="layout">
            <Tabs.List>
              <Tabs.Tab value="layout" leftSection={<IconLayout size={16} />}>
                Layout
              </Tabs.Tab>
              <Tabs.Tab
                value="colors"
                leftSection={<IconPalette size={16} />}
                disabled
              >
                Colors
              </Tabs.Tab>
              <Tabs.Tab
                value="typography"
                leftSection={<IconTypography size={16} />}
                disabled
              >
                Typography
              </Tabs.Tab>
              <Tabs.Tab
                value="components"
                leftSection={<IconComponents size={16} />}
                disabled
              >
                Components
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="layout" pt="md">
              <Stack gap="lg">
                {/* Sidebar Configuration */}
                <div>
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
                        updateConfig(['layout', 'sidebar', 'variant'], value)
                      }
                    />

                    <Stack gap={0}>
                      <Text fz="sm">Position</Text>
                      <SegmentedControl
                        data={[
                          { value: 'left', label: 'Left' },
                          { value: 'right', label: 'Right' },
                        ]}
                        value={config.layout.sidebar.position}
                        onChange={(value) =>
                          updateConfig(['layout', 'sidebar', 'position'], value)
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
                          updateConfig(
                            ['layout', 'sidebar', 'width'],
                            parseInt(value),
                          )
                        }
                      />
                    </Box>

                    <Switch
                      label="Collapsible"
                      checked={config.layout.sidebar.collapsible}
                      onChange={(e) =>
                        updateConfig(
                          ['layout', 'sidebar', 'collapsible'],
                          e.currentTarget.checked,
                        )
                      }
                    />

                    <Switch
                      label="Overlay on mobile"
                      checked={config.layout.sidebar.overlay}
                      onChange={(e) =>
                        updateConfig(
                          ['layout', 'sidebar', 'overlay'],
                          e.currentTarget.checked,
                        )
                      }
                    />
                  </Stack>
                </div>

                <Divider />

                {/* Header Configuration */}
                <div>
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
                        updateConfig(['layout', 'header', 'variant'], value)
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
                        updateConfig(['layout', 'header', 'position'], value)
                      }
                    />

                    <Box>
                      <Text size="sm" fw={500} mb={4}>
                        Height
                      </Text>
                      <SegmentedControl
                        data={[
                          { value: '50', label: 'Compact' },
                          { value: '60', label: 'Default' },
                          { value: '80', label: 'Expanded' },
                        ]}
                        value={config.layout.header.height.toString()}
                        onChange={(value) =>
                          updateConfig(
                            ['layout', 'header', 'height'],
                            parseInt(value),
                          )
                        }
                      />
                    </Box>

                    <Switch
                      label="Show shadow"
                      checked={config.layout.header.showShadow}
                      onChange={(e) =>
                        updateConfig(
                          ['layout', 'header', 'showShadow'],
                          e.currentTarget.checked,
                        )
                      }
                    />
                  </Stack>
                </div>

                <Divider />

                {/* Content Layout Configuration */}
                <div>
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
                          updateConfig(['layout', 'content', 'layout'], value)
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
                          updateConfig(['layout', 'content', 'padding'], value)
                        }
                      />
                    </Box>
                  </Stack>
                </div>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="colors" pt="md">
              <Stack align="center" mt="xl">
                <Text c="dimmed" size="sm">
                  Color customization coming soon
                </Text>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="typography" pt="md">
              <Stack align="center" mt="xl">
                <Text c="dimmed" size="sm">
                  Typography customization coming soon
                </Text>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="components" pt="md">
              <Stack align="center" mt="xl">
                <Text c="dimmed" size="sm">
                  Component customization coming soon
                </Text>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </ScrollArea>

        <Box
          pt="md"
          style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}
        >
          <Group justify="space-between">
            <Button
              variant="subtle"
              leftSection={<IconRefresh size={16} />}
              onClick={handleReset}
              disabled={!hasChanges}
            >
              Reset
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleApply}
              disabled={!hasChanges}
            >
              Apply Changes
            </Button>
          </Group>
        </Box>
      </Stack>
    </Drawer>
  );
}

'use client';

import React, { useEffect } from 'react';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  ColorSwatch,
  Divider,
  Drawer,
  Group,
  Paper,
  ScrollArea,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Tabs,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconBorderRadius,
  IconCircle,
  IconCircleHalf2,
  IconComponents,
  IconDeviceFloppy,
  IconLayout,
  IconLayoutDistributeVertical,
  IconLayoutNavbar,
  IconLayoutSidebar,
  IconMoonStars,
  IconPalette,
  IconRectangle,
  IconRefresh,
  IconSquare,
  IconSunHigh,
  IconTypography,
  IconX,
  IconZoomIn,
} from '@tabler/icons-react';

import {
  COLOR_SCHEMES,
  PrimaryColor,
  useThemeCustomizer,
} from '@/contexts/ThemeCustomizerContext';

interface ThemeCustomizerProps {
  opened: boolean;
  onClose: () => void;
}

// Color Picker Component
const ColorPicker = ({
  value,
  onChange,
}: {
  value: PrimaryColor;
  onChange: (color: PrimaryColor) => void;
}) => {
  return (
    <SimpleGrid cols={6} spacing="xs">
      {Object.entries(COLOR_SCHEMES).map(([key, colorInfo]) => (
        <Tooltip key={key} label={colorInfo.name} position="top">
          <ActionIcon
            variant={value === key ? 'filled' : 'subtle'}
            size="lg"
            radius="md"
            onClick={() => onChange(key as PrimaryColor)}
            style={{
              backgroundColor: value === key ? colorInfo.color : 'transparent',
              border: `2px solid ${
                value === key ? colorInfo.color : 'transparent'
              }`,
            }}
          >
            <ColorSwatch color={colorInfo.color} size={18} />
          </ActionIcon>
        </Tooltip>
      ))}
    </SimpleGrid>
  );
};

export default function ThemeCustomizer({
  opened,
  onClose,
}: ThemeCustomizerProps) {
  const {
    config,
    previewConfig,
    updatePreviewConfig,
    applyPreview,
    resetPreview,
    hasUnsavedChanges,
    setPrimaryColor,
    setColorScheme,
    setBorderRadius,
    toggleCompactMode,
  } = useThemeCustomizer();

  const { setColorScheme: setMantineColorScheme, colorScheme } =
    useMantineColorScheme();

  // Update color scheme immediately when preview config changes
  useEffect(() => {
    if (opened) {
      setMantineColorScheme(previewConfig.appearance.colorScheme);
    }
  }, [previewConfig.appearance.colorScheme, setMantineColorScheme, opened]);

  const updateConfig = (path: string[], value: any) => {
    const newConfig = { ...previewConfig };
    let current: any = newConfig;

    for (let i = 0; i < path.length - 1; i++) {
      current[path[i]] = { ...current[path[i]] };
      current = current[path[i]];
    }

    current[path[path.length - 1]] = value;
    updatePreviewConfig(newConfig);
  };

  const handleApply = () => {
    applyPreview();
    onClose();
  };

  const handleReset = () => {
    resetPreview();
  };

  const handleClose = () => {
    // Reset color scheme to saved config when closing
    setMantineColorScheme(config.appearance.colorScheme);
    onClose();
  };

  const sidebarVariantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'colored', label: 'Colored' },
    { value: 'gradient', label: 'Gradient' },
  ];

  const headerVariantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'colored', label: 'Colored' },
    { value: 'gradient', label: 'Gradient' },
  ];

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      title={
        <Group>
          <IconPalette size={20} />
          <Text fw={600}>Theme Customizer</Text>
          {hasUnsavedChanges && (
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
        <Text fz="sm" c="dimmed" mb="md">
          Explore different styles according to your preferences. Changes are
          previewed in real-time.
        </Text>

        <ScrollArea style={{ flex: 1 }} offsetScrollbars>
          <Tabs defaultValue="layout">
            <Tabs.List>
              <Tabs.Tab value="layout" leftSection={<IconLayout size={16} />}>
                Layout
              </Tabs.Tab>
              <Tabs.Tab
                value="appearance"
                leftSection={<IconPalette size={16} />}
              >
                Appearance
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
                <Paper p="sm" withBorder>
                  <Group mb="sm">
                    <IconLayoutSidebar size={20} />
                    <Text fw={600}>Sidebar</Text>
                  </Group>

                  <Stack gap="md">
                    <Select
                      label="Variant"
                      data={sidebarVariantOptions}
                      value={previewConfig.layout.sidebar.variant}
                      onChange={(value) =>
                        updateConfig(['layout', 'sidebar', 'variant'], value)
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
                        value={previewConfig.layout.sidebar.position}
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
                        value={previewConfig.layout.sidebar.width.toString()}
                        onChange={(value) =>
                          updateConfig(
                            ['layout', 'sidebar', 'width'],
                            parseInt(value),
                          )
                        }
                      />
                    </Box>

                    <Switch
                      label="Visible"
                      description="Show or hide the sidebar"
                      checked={previewConfig.layout.sidebar.visible}
                      onChange={(e) =>
                        updateConfig(
                          ['layout', 'sidebar', 'visible'],
                          e.currentTarget.checked,
                        )
                      }
                    />

                    <Switch
                      label="Overlay mode"
                      description="Sidebar overlays content instead of pushing it aside"
                      checked={previewConfig.layout.sidebar.overlay}
                      onChange={(e) =>
                        updateConfig(
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
                      value={previewConfig.layout.header.variant}
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
                      value={previewConfig.layout.header.position}
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
                          { value: '50', label: 'Small' },
                          { value: '60', label: 'Default' },
                          { value: '80', label: 'Large' },
                        ]}
                        value={previewConfig.layout.header.height.toString()}
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
                      checked={previewConfig.layout.header.showShadow}
                      onChange={(e) =>
                        updateConfig(
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
                        value={previewConfig.layout.content.layout}
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
                        value={previewConfig.layout.content.padding}
                        onChange={(value) =>
                          updateConfig(['layout', 'content', 'padding'], value)
                        }
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="appearance" pt="md">
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
                        value={previewConfig.appearance.colorScheme}
                        onChange={(value) =>
                          updateConfig(['appearance', 'colorScheme'], value)
                        }
                      />
                    </Box>

                    <Box>
                      <Text size="sm" fw={500} mb={8}>
                        Primary Color
                      </Text>
                      <ColorPicker
                        value={previewConfig.appearance.primaryColor}
                        onChange={(color) =>
                          updateConfig(['appearance', 'primaryColor'], color)
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
                      checked={previewConfig.appearance.compact}
                      onChange={(e) =>
                        updateConfig(
                          ['appearance', 'compact'],
                          e.currentTarget.checked,
                        )
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
                        value={previewConfig.appearance.borderRadius}
                        onChange={(value) =>
                          updateConfig(['appearance', 'borderRadius'], value)
                        }
                      />
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
                        color={
                          COLOR_SCHEMES[previewConfig.appearance.primaryColor]
                            .color
                        }
                        size={16}
                        style={{ display: 'inline-block' }}
                      />{' '}
                      {
                        COLOR_SCHEMES[previewConfig.appearance.primaryColor]
                          .name
                      }
                    </Text>

                    <Group>
                      <Button
                        variant="filled"
                        size={previewConfig.appearance.compact ? 'xs' : 'sm'}
                        radius={previewConfig.appearance.borderRadius}
                      >
                        Primary Button
                      </Button>
                      <Button
                        variant="outline"
                        size={previewConfig.appearance.compact ? 'xs' : 'sm'}
                        radius={previewConfig.appearance.borderRadius}
                      >
                        Outline Button
                      </Button>
                    </Group>

                    <Paper
                      p={previewConfig.appearance.compact ? 'xs' : 'sm'}
                      withBorder
                      radius={previewConfig.appearance.borderRadius}
                    >
                      <Text size="sm">
                        Sample card content with current settings
                      </Text>
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

        <Box pt="md">
          <Group justify="space-between">
            <Button
              variant="subtle"
              leftSection={<IconRefresh size={16} />}
              onClick={handleReset}
              disabled={!hasUnsavedChanges}
            >
              Reset
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleApply}
              disabled={!hasUnsavedChanges}
            >
              Save Changes
            </Button>
          </Group>
        </Box>
      </Stack>
    </Drawer>
  );
}

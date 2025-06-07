'use client';

import { useEffect } from 'react';

import {
  Badge,
  Box,
  Button,
  Drawer,
  Group,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconDeviceFloppy,
  IconLayout,
  IconPalette,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';

import { useThemeCustomizer } from '@/contexts/theme-customizer';

import { ThemePreviewCanvas } from './components/ThemePreviewCanvas';
import { AppearanceTab } from './tabs/AppearanceTab';
import { LayoutTab } from './tabs/LayoutTab';

interface ThemeCustomizerDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export default function ThemeCustomizerDrawer({
  opened,
  onClose,
}: ThemeCustomizerDrawerProps) {
  const {
    config,
    previewConfig,
    updatePreviewConfig,
    applyPreview,
    resetPreview,
    hasUnsavedChanges,
  } = useThemeCustomizer();

  const { setColorScheme: setMantineColorScheme } = useMantineColorScheme();

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
      size="100%"
      padding="md"
      closeButtonProps={{
        icon: <IconX size={16} />,
      }}
    >
      <Group grow align="start" h="100%" gap="xl" wrap="nowrap">
        {/* Customization Controls */}
        <Box w={360} style={{ minWidth: 320 }}>
          <Stack gap="sm">
            <Text fz="sm" c="dimmed">
              Explore different styles. Changes are previewed in real-time.
            </Text>
            <ScrollArea h="calc(100vh - 180px)" offsetScrollbars>
              <Tabs defaultValue="layout">
                <Tabs.List grow>
                  <Tabs.Tab
                    value="layout"
                    leftSection={<IconLayout size={16} />}
                  >
                    Layout
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="appearance"
                    leftSection={<IconPalette size={16} />}
                  >
                    Appearance
                  </Tabs.Tab>
                  {/* Add more tabs here */}
                </Tabs.List>

                <Tabs.Panel value="layout" pt="md">
                  <LayoutTab
                    config={previewConfig}
                    onConfigUpdate={updateConfig}
                  />
                </Tabs.Panel>

                <Tabs.Panel value="appearance" pt="md">
                  <AppearanceTab
                    config={previewConfig}
                    onConfigUpdate={updateConfig}
                  />
                </Tabs.Panel>
              </Tabs>
            </ScrollArea>
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
          </Stack>
        </Box>

        {/* Preview Canvas */}
        <ThemePreviewCanvas config={previewConfig} />
      </Group>
    </Drawer>
  );
}

import {
  Accordion,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  ColorSwatch,
  Group,
  Image,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core';
import { IconComponents } from '@tabler/icons-react';

import { COLOR_SCHEMES, ThemeConfig } from '@/contexts/theme-customizer';

interface ThemePreviewCanvasProps {
  config: ThemeConfig;
}

export const ThemePreviewCanvas: React.FC<ThemePreviewCanvasProps> = ({
  config,
}) => {
  return (
    <Box p="lg" style={{ flex: 1 }}>
      <Group mb="md">
        <IconComponents size={20} />
        <Text fw={600}>Preview</Text>
      </Group>
      <ScrollArea h="calc(100vh - 180px)" offsetScrollbars>
        <Paper p="md" withBorder>
          <Stack>
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

            <Tabs defaultValue="preview">
              <Tabs.List>
                <Tabs.Tab value="preview">Tab 1</Tabs.Tab>
                <Tabs.Tab value="preview2">Tab 2</Tabs.Tab>
                <Tabs.Tab value="disabled" disabled>
                  Disabled
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="preview" pt="xs">
                <Text>This is a tab preview.</Text>
              </Tabs.Panel>
              <Tabs.Panel value="preview2" pt="xs">
                <Text>This is a tab preview 2.</Text>
              </Tabs.Panel>
            </Tabs>

            <Stack>
              <Text size="lg" fw={600}>
                Badges
              </Text>
              <Group>
                <Badge>Default</Badge>
                <Badge color="primary">Primary</Badge>
                <Badge variant="outline">Outline</Badge>
              </Group>
            </Stack>

            <Group>
              <TextInput
                label="Text Input"
                placeholder="Your name"
                radius={config.appearance.borderRadius}
                size={config.appearance.compact ? 'xs' : 'sm'}
              />
              <Select
                label="Select Input"
                data={['Option 1', 'Option 2']}
                placeholder="Pick one"
                radius={config.appearance.borderRadius}
                size={config.appearance.compact ? 'xs' : 'sm'}
              />
              <NumberInput
                label="Number Input"
                placeholder="Input placeholder"
              />
            </Group>

            <Alert title="Notice" radius={config.appearance.borderRadius}>
              This is an alert box for preview purposes.
            </Alert>

            <Accordion
              defaultValue="item-1"
              variant="contained"
              radius={config.appearance.borderRadius}
            >
              <Accordion.Item value="item-1">
                <Accordion.Control>Accordion 1</Accordion.Control>
                <Accordion.Panel>Panel 1 content</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="item-2">
                <Accordion.Control>Accordion 2</Accordion.Control>
                <Accordion.Panel>Panel 2 content</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="item-3">
                <Accordion.Control>Accordion 3</Accordion.Control>
                <Accordion.Panel>Panel 3 content</Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Card
              shadow="sm"
              radius={config.appearance.borderRadius}
              withBorder
            >
              <Card.Section>
                <Image
                  src="https://placehold.co/600x200"
                  height={140}
                  alt="Preview"
                />
              </Card.Section>
              <Text fw={500} mt="md">
                Preview Card
              </Text>
              <Text size="sm" c="dimmed" mt={4}>
                This is an example card with an image and current theme styling.
              </Text>
              <Button
                variant="light"
                fullWidth
                mt="md"
                radius={config.appearance.borderRadius}
              >
                Click me
              </Button>
            </Card>
          </Stack>
        </Paper>
      </ScrollArea>
    </Box>
  );
};

import {
  Button,
  ColorSwatch,
  Drawer,
  DrawerProps,
  MantineTheme,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { upperFirst, useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconMoonStars, IconSunHigh } from '@tabler/icons-react';

type ThemeDrawerProps = {
  primaryColor?: string;
  setPrimaryColor?: (color: string) => void;
} & Pick<DrawerProps, 'opened' | 'onClose'>;

const ThemeDrawer = ({
  primaryColor,
  setPrimaryColor,
  ...others
}: ThemeDrawerProps) => {
  const theme = useMantineTheme();
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  const colors = Object.keys(theme.colors).map((color) => ({
    swatch: theme.colors[color][6],
    color,
  }));
  const tablet_match = useMediaQuery('(max-width: 768px)');

  /**
   * swatches items
   */
  const swatches = colors.map((c) => {
    const { color, swatch } = c;
    return (
      <UnstyledButton
        key={color}
        onClick={() => {
          if (setPrimaryColor) {
            setPrimaryColor(color);
          }
          showNotification({
            title: 'Color theme update',
            message: 'Your theme is awesome! 🤥',
          });
        }}
        style={{ textAlign: 'center' }}
      >
        <ColorSwatch
          component="button"
          color={swatch}
          style={{ color: '#fff', cursor: 'pointer' }}
          size={48}
        >
          {color === primaryColor && <IconCheck width={rem(32)} />}
        </ColorSwatch>
        <Text tt="capitalize" mt="xs">
          {color}
        </Text>
      </UnstyledButton>
    );
  });

  return (
    <Drawer
      {...others}
      position="right"
      title="Theme Customizer"
      padding="lg"
      size="xs"
      transitionProps={{
        transition: tablet_match ? 'slide-up' : 'slide-left',
      }}
    >
      <Stack gap="lg">
        <Tooltip label="switch to light/dark mode">
          <Button
            leftSection={
              colorScheme === 'light' ? (
                <IconMoonStars size={18} />
              ) : (
                <IconSunHigh size={18} />
              )
            }
            onClick={() => {
              toggleColorScheme();
              showNotification({
                title: `${upperFirst(
                  colorScheme === 'dark' ? 'light' : 'dark',
                )} is on`,
                message: `You just switched to ${
                  colorScheme === 'dark' ? 'light' : 'dark'
                } mode. Hope you like it`,
                styles: (theme: MantineTheme) => ({
                  root: {
                    backgroundColor:
                      colorScheme === 'dark'
                        ? theme.colors.gray[7]
                        : theme.colors.gray[2],
                    borderColor:
                      colorScheme === 'dark'
                        ? theme.colors.gray[7]
                        : theme.colors.gray[2],

                    '&::before': {
                      backgroundColor:
                        colorScheme === 'dark'
                          ? theme.colors.gray[2]
                          : theme.colors.gray[7],
                    },
                  },

                  title: {
                    color:
                      colorScheme === 'dark'
                        ? theme.colors.gray[2]
                        : theme.colors.gray[7],
                  },
                  description: {
                    color:
                      colorScheme === 'dark'
                        ? theme.colors.gray[2]
                        : theme.colors.gray[7],
                  },
                  closeButton: {
                    color:
                      colorScheme === 'dark'
                        ? theme.colors.gray[2]
                        : theme.colors.gray[7],
                    '&:hover': {
                      backgroundColor: theme.colors.red[5],
                      color: theme.white,
                    },
                  },
                }),
              });
            }}
          >
            Switch to {colorScheme === 'light' ? 'dark' : 'light'} mode
          </Button>
        </Tooltip>
        <SimpleGrid cols={4} spacing={{ base: 10, sm: 'sm' }}>
          {swatches}
        </SimpleGrid>
      </Stack>
    </Drawer>
  );
};

export default ThemeDrawer;

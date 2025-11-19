import { MantineTheme, createTheme, rem } from '@mantine/core';

// Create a dynamic theme that responds to our theme customizer
export const createDynamicTheme = (config: {
  primaryColor: string;
  borderRadius: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  compact: boolean;
}): Partial<MantineTheme> | any => {
  const spacingScale = config.compact ? 0.8 : 1;

  return createTheme({
    primaryColor: config.primaryColor,

    // Preserve the font family
    fontFamily:
      'Open Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
    fontFamilyMonospace:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',

    // Dynamic spacing based on compact mode
    spacing: {
      xs: rem(8 * spacingScale),
      sm: rem(12 * spacingScale),
      md: rem(16 * spacingScale),
      lg: rem(20 * spacingScale),
      xl: rem(24 * spacingScale),
    },

    // Dynamic border radius
    radius: {
      xs: rem(config.borderRadius === 'xs' ? 2 : 4),
      sm: rem(
        config.borderRadius === 'sm' ? 4 : config.borderRadius === 'xs' ? 2 : 6,
      ),
      md: rem(
        config.borderRadius === 'xs'
          ? 4
          : config.borderRadius === 'sm'
            ? 6
            : config.borderRadius === 'md'
              ? 8
              : config.borderRadius === 'lg'
                ? 12
                : 16,
      ),
      lg: rem(
        config.borderRadius === 'xs'
          ? 6
          : config.borderRadius === 'sm'
            ? 8
            : config.borderRadius === 'md'
              ? 12
              : config.borderRadius === 'lg'
                ? 16
                : 20,
      ),
      xl: rem(
        config.borderRadius === 'xs'
          ? 8
          : config.borderRadius === 'sm'
            ? 12
            : config.borderRadius === 'md'
              ? 16
              : config.borderRadius === 'lg'
                ? 20
                : 24,
      ),
    },

    // Custom font sizes that respond to compact mode
    fontSizes: {
      xs: rem(10 * spacingScale),
      sm: rem(12 * spacingScale),
      md: rem(14 * spacingScale),
      lg: rem(16 * spacingScale),
      xl: rem(18 * spacingScale),
    },

    // Custom line heights
    lineHeights: {
      xs: '1.3',
      sm: '1.35',
      md: '1.4',
      lg: '1.45',
      xl: '1.5',
    },

    // Component-specific overrides
    components: {
      Button: {
        defaultProps: {
          radius: config.borderRadius,
        },
        styles: {
          root: {
            height: config.compact ? rem(28) : rem(36),
            fontSize: config.compact ? rem(12) : rem(14),
            padding: config.compact ? `0 ${rem(12)}` : `0 ${rem(16)}`,
          },
        },
      },

      Card: {
        defaultProps: {
          radius: config.borderRadius,
          padding: config.compact ? 'sm' : 'md',
        },
      },

      Paper: {
        defaultProps: {
          radius: config.borderRadius,
        },
      },

      TextInput: {
        defaultProps: {
          radius: config.borderRadius,
        },
        styles: {
          label: {
            fontSize: config.compact ? rem(12) : rem(14),
          },
          input: {
            height: config.compact ? rem(32) : rem(36),
            fontSize: config.compact ? rem(12) : rem(14),
          },
        },
      },

      Textarea: {
        defaultProps: {
          radius: config.borderRadius,
        },
        styles: {
          label: {
            fontSize: config.compact ? rem(12) : rem(14),
          },
          input: {
            fontSize: config.compact ? rem(12) : rem(14),
          },
        },
      },

      DateInput: {
        defaultProps: {
          radius: config.borderRadius,
        },
        styles: {
          label: {
            fontSize: config.compact ? rem(12) : rem(14),
          },
          input: {
            height: config.compact ? rem(32) : rem(36),
            fontSize: config.compact ? rem(12) : rem(14),
          },
        },
      },

      NumberInput: {
        defaultProps: {
          radius: config.borderRadius,
        },
        styles: {
          label: {
            fontSize: config.compact ? rem(12) : rem(14),
          },
          input: {
            height: config.compact ? rem(32) : rem(36),
            fontSize: config.compact ? rem(12) : rem(14),
          },
        },
      },

      Select: {
        defaultProps: {
          radius: config.borderRadius,
        },
        styles: {
          label: {
            fontSize: config.compact ? rem(12) : rem(14),
          },
          input: {
            height: config.compact ? rem(32) : rem(36),
            fontSize: config.compact ? rem(12) : rem(14),
          },
        },
      },

      Modal: {
        defaultProps: {
          radius: config.borderRadius,
        },
      },

      Drawer: {
        defaultProps: {
          radius: config.borderRadius,
        },
      },

      ActionIcon: {
        defaultProps: {
          radius: config.borderRadius,
          variant: 'default',
        },
        styles: {
          root: {
            width: config.compact ? rem(28) : rem(32),
            height: config.compact ? rem(28) : rem(32),
          },
        },
      },

      Badge: {
        defaultProps: {
          radius: config.borderRadius,
        },
      },

      Tabs: {
        styles: {
          tab: {
            padding: config.compact
              ? `${rem(6)} ${rem(12)}`
              : `${rem(8)} ${rem(16)}`,
            fontSize: config.compact ? rem(12) : rem(14),
          },
        },
      },

      NavLink: {
        styles: {
          root: {
            padding: config.compact
              ? `${rem(6)} ${rem(12)}`
              : `${rem(8)} ${rem(16)}`,
            borderRadius: config.borderRadius,
          },
        },
      },

      UnstyledButton: {
        styles: {
          root: {
            fontSize: config.compact ? rem(12) : rem(14),
          },
        },
      },

      Text: {
        styles: {
          root: {
            fontSize: config.compact ? rem(12) : rem(14),
          },
        },
      },

      Menu: {
        defaultProps: {
          radius: config.borderRadius,
        },
      },

      SegmentedControl: {
        defaultProps: {
          radius: config.borderRadius,
        },
      },

      Input: {
        defaultProps: {
          radius: config.borderRadius,
        },
      },

      ThemeIcon: {
        defaultProps: {
          radius: config.borderRadius,
        },
      },

      Alert: {
        defaultProps: {
          radius: config.borderRadius,
        },
        styles: {
          label: {
            fontSize: config.compact ? rem(12) : rem(14),
          },
          message: {
            fontSize: config.compact ? rem(10) : rem(12),
          },
        },
      },

      Anchor: {
        styles: {
          root: {
            fontSize: config.compact ? rem(12) : rem(14),
          },
        },
      },
    },

    // Custom CSS variables that can be used throughout the app
    other: {
      // Theme customizer values
      themeConfig: config,

      // Custom properties for conditional styling
      sidebarWidth: '300px',
      headerHeight: '60px',

      // Animation durations
      transitionDuration: '0.3s',

      // Custom shadows based on theme
      customShadows: {
        card: config.compact
          ? '0 1px 3px rgba(0,0,0,0.12)'
          : '0 2px 8px rgba(0,0,0,0.15)',
        dropdown: '0 4px 16px rgba(0,0,0,0.15)',
        modal: '0 8px 32px rgba(0,0,0,0.2)',
      },
    },
  });
};

// Default theme export (fallback)
export const myTheme = createDynamicTheme({
  primaryColor: 'blue',
  borderRadius: 'sm',
  compact: false,
});

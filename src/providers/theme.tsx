import { COLOR_SCHEMES, useThemeCustomizer } from '@/contexts/theme-customizer';
import { MantineProvider, MantineTheme } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { useEffect, useMemo } from 'react';
import { createDynamicTheme } from '@/theme';
import { ModalsProvider } from '@mantine/modals';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { config } = useThemeCustomizer();

  // Create dynamic theme based on current config
  const dynamicTheme: MantineTheme = useMemo(() => {
    return createDynamicTheme({
      primaryColor: config.appearance.primaryColor,
      borderRadius: config.appearance.borderRadius,
      compact: config.appearance.compact,
    });
  }, [
    config.appearance.primaryColor,
    config.appearance.borderRadius,
    config.appearance.compact,
  ]);

  // Update CSS custom properties when the theme changes
  useEffect(() => {
    const root = document.documentElement;

    // Set primary color CSS variables
    const primaryColor = COLOR_SCHEMES[config.appearance.primaryColor];
    root.style.setProperty('--theme-primary-color', primaryColor.color);

    // Set border radius
    const radiusMap = {
      xs: '0.125rem',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    };
    root.style.setProperty(
      '--theme-border-radius',
      radiusMap[config.appearance.borderRadius],
    );

    // Set spacing scale for compact mode
    const spacingScale = config.appearance.compact ? '0.8' : '1';
    root.style.setProperty('--theme-spacing-scale', spacingScale);

    //Set direction
    root.dir = config.layout.dir;
    
    // Set compact mode flag
    root.style.setProperty(
      '--theme-compact',
      config.appearance.compact ? '1' : '0',
    );

    // Additional CSS variables for layout
    root.style.setProperty(
      '--sidebar-width',
      `${config.layout.sidebar.width}px`,
    );
    root.style.setProperty(
      '--header-height',
      `${config.layout.header.height}px`,
    );
  }, [config]);

  return (
    <MantineProvider
      theme={dynamicTheme}
      defaultColorScheme={config.appearance.colorScheme}
    >
      <DatesProvider
        settings={{
          firstDayOfWeek: 0,
          weekendDays: [0],
          timezone: 'UTC',
        }}
      >
        <Notifications position="bottom-right" zIndex={1000} />
        <ModalsProvider>{children}</ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  );
}

'use client';

import { useEffect, useMemo } from 'react';

import {
  ColorSchemeScript,
  MantineProvider,
  MantineTheme,
} from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Open_Sans } from 'next/font/google';

import { AuthProvider } from '@/components/auth/AuthProvider';
import {
  COLOR_SCHEMES,
  ThemeCustomizerProvider,
  useThemeCustomizer,
} from '@/contexts/theme-customizer';
import { createDynamicTheme } from '@/theme';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/dropzone/styles.css';
import '@mantine/charts/styles.css';
import './globals.css';

// If loading a variable font, you don't need to specify the font weight
const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

// Component that provides the dynamic theme
function ThemeProvider({ children }: { children: React.ReactNode }) {
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

  // Update CSS custom properties when theme changes
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={openSans.className}>
      <head>
        <title>DesignSparx - Nextjs Mantine Admin Dashboard Template</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />

        <script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
        ></script>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <AuthProvider>
          <ThemeCustomizerProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ThemeCustomizerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

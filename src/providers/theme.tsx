import { MantineProvider, MantineTheme } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { useMemo } from 'react';
import { createDynamicTheme } from '@/theme';
import { ModalsProvider } from '@mantine/modals';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dynamicTheme: MantineTheme = useMemo(() => {
    return createDynamicTheme({
      primaryColor: 'blue',
      borderRadius: 'sm',
      compact: false,
    });
  }, []);

  return (
    <MantineProvider theme={dynamicTheme} defaultColorScheme="auto">
      <DatesProvider
        settings={{
          firstDayOfWeek: 0,
          weekendDays: [0],
        }}
      >
        <Notifications
          position="bottom-right"
          zIndex={1000}
          pauseResetOnHover="notification"
        />
        <ModalsProvider>{children}</ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  );
}

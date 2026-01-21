import React from 'react';
import { ThemeCustomizerProvider } from '@/contexts/theme-customizer';
import { SystemNotificationsProvider } from '@/contexts/system-notifications';
import { ThemeProvider } from '@/providers/theme';
import { DirectionProvider } from '@mantine/core';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <DirectionProvider>
      <SystemNotificationsProvider>
        <ThemeCustomizerProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ThemeCustomizerProvider>
      </SystemNotificationsProvider>
    </DirectionProvider>
  );
};

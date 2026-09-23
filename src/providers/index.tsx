import React from 'react';
import { SystemNotificationsProvider } from '@/contexts/system-notifications';
import { ThemeProvider } from '@/providers/theme';
import { DirectionProvider } from '@mantine/core';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <DirectionProvider>
      <SystemNotificationsProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SystemNotificationsProvider>
    </DirectionProvider>
  );
};

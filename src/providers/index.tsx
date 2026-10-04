import React from 'react';

import { DirectionProvider } from '@mantine/core';

import { SystemNotificationsProvider } from '@/contexts/system-notifications';
import { ThemeProvider } from '@/providers/theme';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <DirectionProvider>
      <SystemNotificationsProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SystemNotificationsProvider>
    </DirectionProvider>
  );
};

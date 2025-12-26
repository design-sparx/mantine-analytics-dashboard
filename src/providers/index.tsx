import React from 'react';
import { ThemeCustomizerProvider } from '@/contexts/theme-customizer';
import { SystemNotificationsProvider } from '@/contexts/system-notifications';
import { ThemeProvider } from '@/providers/theme';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SystemNotificationsProvider>
      <ThemeCustomizerProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ThemeCustomizerProvider>
    </SystemNotificationsProvider>
  );
};

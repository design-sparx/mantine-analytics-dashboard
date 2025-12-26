// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';

import React, { useEffect } from 'react';
import { addons } from '@storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { MantineProvider, useMantineColorScheme } from '@mantine/core';
import { themes } from '@storybook/theming';
import { Preview } from '@storybook/react';
// @ts-ignore
import { myTheme } from '../src/theme';

// theme.ts file from previous step

const channel = addons.getChannel();

function ColorSchemeWrapper({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useMantineColorScheme();
  const handleColorScheme = (value: boolean) =>
    setColorScheme(value ? 'dark' : 'light');

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, [channel]);

  return <>{children}</>;
}

export const decorators = [
  (renderStory: any) => (
    <ColorSchemeWrapper>{renderStory()}</ColorSchemeWrapper>
  ),
  (renderStory: any) => (
    <MantineProvider theme={myTheme}>{renderStory()}</MantineProvider>
  ),
];

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    docs: {
      theme: themes.normal,
    },
  },
  decorators: decorators,
};

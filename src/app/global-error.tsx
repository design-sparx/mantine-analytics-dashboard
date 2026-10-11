'use client';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';

import { createDynamicTheme } from '@/theme';

import ErrorPage from './error';

import '@mantine/core/styles.css';

// Replaces the root layout when the layout itself throws, so it renders its own
// <html> and <body>. Only MantineProvider is set up here: the app's Providers
// tree may be what crashed.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider
          theme={createDynamicTheme({
            primaryColor: 'blue',
            borderRadius: 'sm',
            compact: false,
          })}
          defaultColorScheme="auto"
        >
          <ErrorPage error={error} reset={reset} />
        </MantineProvider>
      </body>
    </html>
  );
}

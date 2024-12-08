import { ActionIcon, Loader, createTheme } from '@mantine/core';

export const myTheme = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
  focusRing: 'auto',
  fontFamily: 'Open Sans, sans-serif',
  headings: { fontFamily: 'Open Sans, sans-serif' },
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'subtle',
      },
    }),
    Loader: Loader.extend({
      defaultProps: {
        type: 'bars',
      },
    }),
  },
});

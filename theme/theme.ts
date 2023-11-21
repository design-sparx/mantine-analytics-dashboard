import {ActionIcon, createTheme} from '@mantine/core';

export const myTheme = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 6,
  focusRing: "always",
  fontFamily: 'Open Sans, sans-serif',
  headings: {fontFamily: 'Open Sans, sans-serif'},
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: "subtle"
      }
    })
  }
});


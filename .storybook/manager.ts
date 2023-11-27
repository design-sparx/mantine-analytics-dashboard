// .storybook/manager.js

import { addons } from '@storybook/manager-api';
import myTheme from './theme';

addons.setConfig({
  theme: myTheme,
});

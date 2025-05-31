import { ReactNode } from 'react';

import { Box } from '@mantine/core';

import layoutClasses from './AppMain.module.css';

type AppMainProps = {
  children: ReactNode;
};

const AppMain = ({ children }: AppMainProps) => {
  return <Box className={layoutClasses.appMain}>{children}</Box>;
};

export default AppMain;

import { ReactNode } from 'react';
import { Box } from '@mantine/core';
import classes from './App.module.css';

type AppMainProps = {
  children: ReactNode;
};

const AppMain = ({ children }: AppMainProps) => {
  return (
    <Box py="lg" px="md" className={classes.main}>
      {children}
    </Box>
  );
};

export default AppMain;

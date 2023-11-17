import React, {ReactNode} from 'react';
import {Center, useMantineTheme} from "@mantine/core";

type ErrorProps = {
  children: ReactNode
}

const ErrorLayout = ({children}: ErrorProps) => {
  const theme = useMantineTheme()

  return (
    <Center
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: theme.colors.gray[0],
        color: theme.colors.dark[8]
      }}
    >
      {children}
    </Center>
  );
};

export default ErrorLayout;

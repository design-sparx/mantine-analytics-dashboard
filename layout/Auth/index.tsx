import {Center, Stack, useMantineTheme} from "@mantine/core";
import Image from "next/image";
import React, {ReactNode} from "react";

type AuthProps = {
    children: ReactNode
}

const AuthLayout = ({children}: AuthProps) => {
    const theme = useMantineTheme()

    return (
      <Center
        style={{
            height: '100vh',
            width: '100vw',
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors[primaryColor][0],
            color: colorScheme === 'dark' ? theme.white : theme.black
        }}
      >
          <Stack>
              <Center>
                  <Image
                    src="/logo-no-background.png"
                    alt="DesignSparx logo"
                    width={96}
                    height={96}
                    style={{objectFit: 'contain'}}
                  />
              </Center>
              {children}
          </Stack>
      </Center>
    );
};

export default AuthLayout;

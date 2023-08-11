import {Center, MantineProvider, Stack, useMantineTheme} from "@mantine/core";
import Image from "next/image";
import React, {ReactNode, useEffect, useState} from "react";

type AuthProps = {
    children: ReactNode
}

const AuthLayout = ({children}: AuthProps) => {
    const theme = useMantineTheme()
    const [primaryColor, setPrimaryColor] = useState<any>('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPrimaryColor(localStorage.getItem('preferred-color'))
        }
    }, []);

    return (
        <MantineProvider inherit theme={{primaryColor: primaryColor || 'blue', primaryShade: 8}}>
            <Center sx={{height: '100vh', width: '100vw', backgroundColor: theme.colors[primaryColor || 'blue'][0]}}>
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
        </MantineProvider>
    );
};

export default AuthLayout;
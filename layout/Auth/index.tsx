import {Center, ColorScheme, ColorSchemeProvider, MantineProvider, Stack, useMantineTheme} from "@mantine/core";
import Image from "next/image";
import React, {ReactNode, useEffect, useState} from "react";
import {useHotkeys, useLocalStorage} from "@mantine/hooks";
import {MantineColor} from "@mantine/styles/lib/theme/types/MantineColor";

type AuthProps = {
    children: ReactNode
}

const AuthLayout = ({children}: AuthProps) => {
    const theme = useMantineTheme()
    const [primaryColor, setPrimaryColor] = useLocalStorage<MantineColor>({
        key: 'mantine-preferred-color-dash-sparx',
        defaultValue: 'blue',
        getInitialValueInEffect: true,
    });
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'mantine-color-scheme-dash-sparx',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });

    /**
     * toggle color scheme dark | light
     * @param value
     */
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider inherit theme={{primaryColor, primaryShade: 8, colorScheme}}>
                <Center
                    sx={{
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
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

export default AuthLayout;
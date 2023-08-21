import React, {ReactNode, useEffect, useState} from 'react';
import {Center, ColorScheme, ColorSchemeProvider, MantineProvider, useMantineTheme} from "@mantine/core";
import {useHotkeys, useLocalStorage} from "@mantine/hooks";
import {MantineColor} from "@mantine/styles/lib/theme/types/MantineColor";

type ErrorProps = {
    children: ReactNode
}

const ErrorLayout = ({children}: ErrorProps) => {
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
            <MantineProvider inherit theme={{primaryColor, primaryShade: 7, colorScheme}}>
                <Center
                    sx={{
                        height: '100vh',
                        width: '100vw',
                        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors[primaryColor][0],
                        color: colorScheme === 'dark' ? theme.white : theme.colors.dark[8]
                    }}
                >
                    {children}
                </Center>
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

export default ErrorLayout;
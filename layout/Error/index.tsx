import React, {ReactNode, useEffect, useState} from 'react';
import {Center, MantineProvider, useMantineTheme} from "@mantine/core";

type ErrorProps = {
    children: ReactNode
}

const ErrorLayout = ({children}: ErrorProps) => {
    const theme = useMantineTheme()
    const [primaryColor, setPrimaryColor] = useState<any>('blue');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPrimaryColor(localStorage.getItem('preferred-color'))
        }
    }, []);

    return (
        <MantineProvider inherit theme={{primaryColor: primaryColor, primaryShade: 7}}>
            <Center sx={{height: '100vh', width: '100vw', backgroundColor: theme.colors[primaryColor][0]}}>
                {children}
            </Center>
        </MantineProvider>
    );
};

export default ErrorLayout;
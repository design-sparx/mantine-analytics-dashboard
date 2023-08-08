import React, {useState} from 'react';
import {
    ColorSwatch,
    Drawer,
    DrawerProps,
    Group,
    MantineTheme,
    useMantineTheme,
    Text,
    UnstyledButton, rem, Box, SimpleGrid
} from "@mantine/core";
import {IconCheck} from "@tabler/icons-react";
import {showNotification} from "@mantine/notifications";

type ThemeDrawerProps = {
    primaryColor: string,
    setPrimaryColor: (color: string) => void
} & Pick<DrawerProps, 'opened' | 'onClose'>

const ThemeDrawer = ({primaryColor, setPrimaryColor, ...others}: ThemeDrawerProps) => {
    const theme = useMantineTheme()
    const colors = Object.keys(theme.colors).map((color) => ({
        swatch: theme.colors[color][6],
        color
    }));

    /**
     * swatches items
     */
    const swatches = colors.map((c) => {
            const {color, swatch} = c
            return <UnstyledButton
                key={color}
                onClick={() => {
                    setPrimaryColor(color);
                    showNotification({
                        title: 'Color theme update',
                        message: 'Your theme is awesome! 🤥',
                        styles: (theme: MantineTheme) => ({})
                    });
                }}
                sx={{textAlign: 'center'}}
            >
                <ColorSwatch
                    component="button"
                    color={swatch}
                    sx={{color: '#fff', cursor: 'pointer'}}
                    size={48}
                >
                    {color === primaryColor && <IconCheck width={rem(32)}/>}
                </ColorSwatch>
                <Text>{color}</Text>
            </UnstyledButton>
        }
    );

    return (
        <Drawer {...others} position="right">
            <SimpleGrid cols={4} spacing="xs">{swatches}</SimpleGrid>
        </Drawer>
    );
};

export default ThemeDrawer;
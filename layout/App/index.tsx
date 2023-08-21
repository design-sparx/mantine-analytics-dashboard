import {
    ActionIcon,
    Affix,
    AppShell,
    Box,
    ColorScheme,
    ColorSchemeProvider,
    Container,
    Footer,
    Header,
    MantineProvider,
    rem, useMantineTheme,
} from '@mantine/core';
import React, {useState} from 'react';
import Navigation from "@/layout/App/Navigation/Navigation";
import HeaderNav from "@/layout/App/HeaderNav/HeaderNav";
import {useDisclosure, useHotkeys, useLocalStorage, useMediaQuery} from "@mantine/hooks";
import {ThemeDrawer} from "@/components";
import FooterNav from "@/layout/App/FooterNav/FooterNav";
import {IconPaint} from "@tabler/icons-react";
import {MantineColor} from "@mantine/styles/lib/theme/types/MantineColor";

type Props = {
    children: React.ReactNode;
};

function AppLayout({children}: Props) {
    const [opened, setOpened] = useState(false);
    const [themeOpened, {open: themeOpen, close: themeClose}] = useDisclosure(false);
    const theme = useMantineTheme()
    const tablet_match = useMediaQuery('(max-width: 768px)');
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

    const handleThemeChange = (c: string) => {
        setPrimaryColor(c);
    }

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider inherit theme={{primaryColor, primaryShade: 7, colorScheme}}>
                <AppShell
                    layout="alt"
                    navbarOffsetBreakpoint="md"
                    asideOffsetBreakpoint="md"
                    styles={{
                        main: {
                            background: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                            paddingTop: tablet_match ? Number(theme.spacing.xl) * 4 : Number(theme.spacing.xl) * 2
                        },
                    }}
                    navbar={
                        <Navigation
                            hiddenBreakpoint="md"
                            hidden={!opened}
                            width={{sm: 320, lg: 320}}
                            onClose={() => setOpened(false)}
                            sx={{
                                zIndex: 101
                            }}
                        />
                    }
                    header={
                        <Header
                            height={{base: 60, md: 60}}
                            sx={{
                                border: 'none',
                                boxShadow: tablet_match ? theme.shadows.md : theme.shadows.sm,
                                left: tablet_match ? 0 : 'var(--mantine-navbar-width, 0)',
                                right: tablet_match ? 0 : 'var(--mantine-navbar-width, 0)',
                                width: tablet_match ? '100%' : 'calc(100vw - var(--mantine-navbar-width))'
                            }}
                        >
                            <Container fluid py="sm" px="lg">
                                <HeaderNav opened={opened} handleOpen={() => setOpened((o) => !o)}/>
                            </Container>
                        </Header>
                    }
                    footer={
                        <Footer
                            height={{base: 60, md: 60}}
                            px="md"
                            py="sm"
                            sx={{
                                width: tablet_match ? '100%' : 'calc(100vw - var(--mantine-navbar-width))',
                                left: tablet_match ? 0 : 'var(--mantine-navbar-width, 0)',
                                right: tablet_match ? 0 : 'var(--mantine-navbar-width, 0)',
                            }}
                        >
                            <Container fluid px="lg">
                                <FooterNav/>
                            </Container>
                        </Footer>
                    }
                >
                    <Box mt={16}>
                        {children}
                    </Box>
                    <Affix position={{bottom: rem(48), right: rem(40)}} sx={{zIndex: 100}}>
                        <ActionIcon
                            size={56}
                            onClick={themeOpen}
                            variant="filled"
                            color="primary"
                            radius="50%"
                            sx={{boxShadow: theme.shadows.xl}}
                        >
                            <IconPaint size={24}/>
                        </ActionIcon>
                    </Affix>
                    <ThemeDrawer
                        opened={themeOpened}
                        onClose={themeClose}
                        primaryColor={primaryColor}
                        setPrimaryColor={handleThemeChange}
                        colorScheme={colorScheme}
                        toggleColorScheme={toggleColorScheme}
                    />
                </AppShell>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}

export default AppLayout;

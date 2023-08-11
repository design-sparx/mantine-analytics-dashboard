import {
    ActionIcon,
    Affix,
    AppShell,
    Box,
    Burger,
    Button,
    Container,
    Footer,
    Header,
    MantineProvider,
    MediaQuery,
    rem, useMantineTheme,
} from '@mantine/core';
import React, {useEffect, useState} from 'react';
import Navigation from "@/layout/App/Navigation/Navigation";
import HeaderNav from "@/layout/App/HeaderNav/HeaderNav";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import {ThemeDrawer} from "@/components";
import FooterNav from "@/layout/App/FooterNav/FooterNav";
import {IconPaint} from "@tabler/icons-react";

type Props = {
    children: React.ReactNode;
};

function AppLayout({children}: Props) {
    const [opened, setOpened] = useState(false);
    const [primaryColor, setPrimaryColor] = useState<any>('');
    const [themeOpened, {open: themeOpen, close: themeClose}] = useDisclosure(false);
    const theme = useMantineTheme()
    const tablet_match = useMediaQuery('(max-width: 768px)');

    const handleThemeChange = (c: string) => {
        setPrimaryColor(c);
        if (typeof window !== 'undefined') {
            localStorage.setItem('preferred-color', c)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPrimaryColor(localStorage.getItem('preferred-color'))
        }
    }, []);

    return (
        <MantineProvider inherit theme={{primaryColor: primaryColor || 'blue', primaryShade: 7}}>
            <AppShell
                layout="alt"
                navbarOffsetBreakpoint="md"
                asideOffsetBreakpoint="md"
                styles={{
                    main: {
                        background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                        paddingTop: tablet_match ? Number(theme.spacing.xl) * 4 : Number(theme.spacing.xl) * 2
                    },
                }}
                navbar={
                    <Navigation
                        hiddenBreakpoint="md"
                        hidden={!opened}
                        width={{sm: 240, lg: 320}}
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
                        <FooterNav/>
                    </Footer>
                }
            >
                <Box mt={16}>
                    {children}
                </Box>
                <Affix position={{bottom: rem(48), right: rem(40)}}>
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
                />
            </AppShell>
        </MantineProvider>
    );
}

export default AppLayout;

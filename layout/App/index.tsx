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
import {useDisclosure} from "@mantine/hooks";
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
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                styles={{
                    main: {
                        background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    },
                }}
                navbar={
                    <Navigation
                        hiddenBreakpoint="sm"
                        hidden={!opened}
                        width={{sm: 200, lg: 320}}
                    />
                }
                header={
                    <Header height={{base: 50, md: 60}} sx={{border: 'none', boxShadow: theme.shadows.sm}}>
                        <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                mr="xl"
                            />
                        </MediaQuery>
                        <Container fluid p="sm">
                            <HeaderNav/>
                        </Container>
                    </Header>
                }
                footer={
                    <Footer height={{base: 50, md: 60}} px="md" py="sm">
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

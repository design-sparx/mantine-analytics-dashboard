import {
    Affix,
    AppShell,
    Burger,
    Button,
    Container,
    Footer,
    Header,
    MantineProvider,
    MediaQuery,
    rem,
} from '@mantine/core';
import React, {useEffect, useState} from 'react';
import Navigation from "@/layout/App/Navigation/Navigation";
import HeaderNav from "@/layout/App/HeaderNav/HeaderNav";
import {useDisclosure} from "@mantine/hooks";
import {ThemeDrawer} from "@/components";

type Props = {
    children: React.ReactNode;
};

function AppLayout({children}: Props) {
    const [opened, setOpened] = useState(false);
    const [primaryColor, setPrimaryColor] = useState<any>('');
    const [themeOpened, {open: themeOpen, close: themeClose}] = useDisclosure(false);

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
        <MantineProvider inherit theme={{primaryColor: primaryColor || 'blue'}}>
            <AppShell
                layout="alt"
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                navbar={
                    <Navigation
                        hiddenBreakpoint="sm"
                        hidden={!opened}
                        width={{sm: 200, lg: 320}}
                    />
                }
                header={
                    <Header height={60}>
                        <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                mr="xl"
                            />
                        </MediaQuery>
                        <Container fluid p="md">
                            <HeaderNav/>
                        </Container>
                    </Header>
                }
                footer={
                    <Footer height={60} p="md">
                        Application footer
                    </Footer>
                }
            >
                {children}
                <Affix position={{bottom: rem(20), right: rem(20)}}>
                    <Button onClick={themeOpen}>Change color</Button>
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

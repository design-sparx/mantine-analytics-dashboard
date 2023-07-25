import {AppShell, Burger, Container, Footer, Header, MediaQuery,} from '@mantine/core';
import React, {useState} from 'react';
import Navigation from "@/layout/Navigation/Navigation";
import HeaderNav from "@/layout/HeaderNav/HeaderNav";

type Props = {
    children: React.ReactNode;
};

function Layout({children}: Props) {
    const [opened, setOpened] = useState(false);
    return (
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
        </AppShell>
    );
}

export default Layout;

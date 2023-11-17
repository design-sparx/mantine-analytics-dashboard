import {Box, Burger, Button, Container, Drawer, Group, rem, ScrollArea, useMantineTheme} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import classes from "./HeaderNav.module.css";
import {PATH_DASHBOARD, PATH_DOCS} from "@/routes";
import {Logo} from "@/components";

const MOCK_DATA = [
    {
        "link": PATH_DASHBOARD.default,
        "label": "live preview"
    },
    {
        "link": PATH_DOCS.root,
        "label": "documentation"
    },
    {
        "link": "mailto:kelvin.kiprop96@gmail.com",
        "label": "support",
    },
]

const HEADER_HEIGHT = rem(60);

const HeaderNav = () => {
    const theme = useMantineTheme()
    const [drawerOpened, {toggle: toggleDrawer, close: closeDrawer}] = useDisclosure(false);
    const tablet_match = useMediaQuery('(max-width: 768px)');

    const items = MOCK_DATA.map((link) => {
        return (
            <a
                key={link.label}
                href={link.link}
                target="_blank"
                className={classes.link}
            >
                {link.label}
            </a>
        );
    });

    return (
        <Box>
            <header className={classes.header}>
                <Container className={classes.inner} fluid>
                    <Logo style={{color: theme.white}}/>
                    <Group spacing="xs" className={classes.links}>
                        {items}
                        <Button>
                            Purchase Now
                        </Button>
                    </Group>
                    <Burger
                        opened={drawerOpened}
                        onClick={toggleDrawer}
                        className={classes.hiddenDesktop}
                        color={theme.white}
                    />
                </Container>
            </header>
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Menu"
                className={classes.hiddenDesktop}
                zIndex={1000000}
                transitionProps={{
                    transition: tablet_match ? 'slide-up' : 'slide-left',
                }}
            >
                <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
                    {items}
                </ScrollArea>
            </Drawer>
        </Box>
    );
}

export default HeaderNav

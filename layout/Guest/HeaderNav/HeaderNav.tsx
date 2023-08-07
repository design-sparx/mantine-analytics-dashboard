import {Burger, Button, Center, Container, Group, Header, Menu, rem, Text} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconChevronDown} from '@tabler/icons-react';
import useStyles from "./HeaderNav.styles";
import {PATH_DASHBOARD} from "@/routes";

const MOCK_DATA = [
    {
        "link": PATH_DASHBOARD.default,
        "label": "live preview"
    },
    {
        "link": PATH_DASHBOARD.default,
        "label": "documentation"
    },
    {
        "link": PATH_DASHBOARD.default,
        "label": "support",
    },
]

const HEADER_HEIGHT = rem(60);

const HeaderNav = () => {
    const {classes} = useStyles();
    const [opened, {toggle}] = useDisclosure(false);
    const items = MOCK_DATA.map((link) => {
        return (
            <a
                key={link.label}
                href={link.link}
                className={classes.link}
                onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </a>
        );
    });

    return (
        <Header height={HEADER_HEIGHT} sx={{borderBottom: 0}} mb={30}>
            <Container className={classes.inner} fluid>
                <Group>
                    <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm"/>
                    <Text>Sparx</Text>
                </Group>
                <Group spacing={5} className={classes.links}>
                    {items}
                    <Button h={30}>
                        Buy Now
                    </Button>
                </Group>
            </Container>
        </Header>
    );
}

export default HeaderNav

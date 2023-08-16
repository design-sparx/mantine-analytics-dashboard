import {Burger, Button, Center, Container, Group, Header, Menu, rem, Text} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconChevronDown} from '@tabler/icons-react';
import useStyles from "./HeaderNav.styles";
import {PATH_DASHBOARD} from "@/routes";
import {Logo} from "@/components";

const MOCK_DATA = [
    {
        "link": PATH_DASHBOARD.default,
        "label": "live preview"
    },
    {
        "link": "https://analytics-dashboard-docs.netlify.app/",
        "label": "documentation"
    },
    {
        "link": "mailto:kelvin.kiprop96@gmail.com",
        "label": "support",
    },
]

const HEADER_HEIGHT = rem(60);

const HeaderNav = () => {
    const {classes, theme} = useStyles();
    const [opened, {toggle}] = useDisclosure(false);
    const items = MOCK_DATA.map((link) => {
        return (
            <a
                key={link.label}
                href={link.link}
                target="_blank"
                className={classes.link}
                onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </a>
        );
    });

    return (
        <Header height={HEADER_HEIGHT}>
            <Container className={classes.inner} fluid>
                <Logo sx={{color: theme.white}}/>
                <Group spacing="xs" className={classes.links}>
                    {items}
                    <Button>
                        Buy Now
                    </Button>
                </Group>
            </Container>
        </Header>
    );
}

export default HeaderNav

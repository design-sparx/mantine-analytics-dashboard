import {
    ActionIcon, ActionIconProps,
    Button,
    Container,
    Divider,
    Flex,
    Group, Stack,
    Text,
    Title
} from '@mantine/core';
import useStyles from "./FooterNav.styles";
import {Logo} from "@/components";
import {
    IconBrandFacebook,
    IconBrandGithub,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconWorld
} from "@tabler/icons-react";

const ACTION_ICON_PROPS: ActionIconProps = {
    size: "lg",
    color: "blue.3",
    variant: "transparent"
}

const FooterNav = () => {
    const {classes} = useStyles();

    return (
        <footer className={classes.footer}>
            <Container mb="xl">
                <Stack>
                    <Title ta="center" order={2}>Start building with Design Sparx today</Title>
                    <Text ta="center">Stop wasting time building your application from scratch. Design Sparx is fast,
                        extendable
                        and fully customizable.</Text>
                    <Group position="center">
                        <Button>Documentation</Button>
                        <Button>Purchase Now</Button>
                    </Group>
                </Stack>
            </Container>
            <Divider my="md"/>
            <Flex justify="space-between">
                <Logo/>
                <Group spacing="xs" position="right" noWrap>
                    <ActionIcon
                        component="a"
                        href="https://kelvinkiprop.netlify.app/"
                        target="_blank"
                        {...ACTION_ICON_PROPS}
                    >
                        <IconWorld/>
                    </ActionIcon>
                    <ActionIcon
                        size="lg"
                        component="a"
                        href="https://github.com/kelvink96"
                        target="_blank"
                        {...ACTION_ICON_PROPS}
                    >
                        <IconBrandGithub/>
                    </ActionIcon>
                    <ActionIcon
                        size="lg"
                        component="a"
                        href="https://twitter.com/kelvink_96"
                        target="_blank"
                        {...ACTION_ICON_PROPS}
                    >
                        <IconBrandTwitter/>
                    </ActionIcon>
                    <ActionIcon
                        size="lg"
                        component="a"
                        href="https://www.linkedin.com/in/kelvink96/"
                        target="_blank"
                        {...ACTION_ICON_PROPS}
                    >
                        <IconBrandLinkedin/>
                    </ActionIcon>
                    <ActionIcon
                        size="lg"
                        component="a"
                        href="https://www.facebook.com/kelvinkk96"
                        target="_blank"
                        {...ACTION_ICON_PROPS}
                    >
                        <IconBrandFacebook/>
                    </ActionIcon>
                    <ActionIcon
                        size="lg"
                        component="a"
                        href="https://www.instagram.com/kelvink_96/"
                        target="_blank"
                        {...ACTION_ICON_PROPS}
                    >
                        <IconBrandInstagram/>
                    </ActionIcon>
                </Group>
            </Flex>
        </footer>
    );
}

export default FooterNav

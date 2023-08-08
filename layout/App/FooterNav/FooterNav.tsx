import React from 'react';
import {Button, ButtonProps, Group, Text} from "@mantine/core";

const BUTTON_PROPS: ButtonProps = {
    variant: "subtle",
    color: "gray.6"
}

const FooterNav = () => {
    return (
        <Group position="apart">
            <Group spacing={4}>
                <Button {...BUTTON_PROPS}>Support</Button>
                <Button {...BUTTON_PROPS}>Help Center</Button>
                <Button {...BUTTON_PROPS}>Privacy</Button>
                <Button {...BUTTON_PROPS}> Terms of Use</Button>
            </Group>
            <Text color="dimmed" size="sm">&copy;&nbsp;{new Date().getFullYear()}&nbsp;DesignSparx</Text>
        </Group>
    );
};

export default FooterNav;

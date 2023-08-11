import {
    Button,
    Center,
    createStyles,
    Group,
    Paper,
    rem,
    Stack,
    Text,
    TextInput, TextProps,
    Title,
    UnstyledButton
} from '@mantine/core';
import {IconChevronLeft} from '@tabler/icons-react';
import Head from "next/head";
import React from "react";
import Link from "next/link";
import {PATH_AUTH, PATH_DASHBOARD} from "@/routes";
import {AuthLayout} from "@/layout";
import {useMediaQuery} from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: rem(26),
        fontWeight: 900,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    controls: {
        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column-reverse',
            alignItems: 'center'
        },
    },

    control: {
        padding: `${rem(6)} ${rem(10)}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        [theme.fn.smallerThan('xs')]: {
            width: '100%',
            textAlign: 'center',
        },

        '&:hover': {
            transition: 'all ease 150ms',
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2],
            color: theme.black,
            textDecoration: 'none'
        }
    },
}));

function PasswordReset() {
    const {classes, theme} = useStyles();
    const mobile_match = useMediaQuery('(max-width: 425px)');

    return (
        <>
            <Head>
                <title>Password reset | DesignSparx</title>
            </Head>
            <AuthLayout>
                <Title align="center">
                    Forgot your password?
                </Title>
                <Text ta="center">
                    Enter your email to get a reset link
                </Text>

                <Paper shadow="xl" p="lg" mt={15} radius="md" sx={{width: rem(mobile_match ? 360 : 460)}}>
                    <TextInput label="Your email" placeholder="me@mantine.dev" required/>
                    <Group position="apart" mt="lg" className={classes.controls}>
                        <UnstyledButton
                            component={Link}
                            href={PATH_AUTH.signin}
                            color="dimmed"
                            className={classes.control}
                        >
                            <Group spacing={2} position="center">
                                <IconChevronLeft size={rem(18)} stroke={1.5}/>
                                <Text size="sm" ml={5}>Back to the login page</Text>
                            </Group>
                        </UnstyledButton>
                        <Button component={Link} href={PATH_DASHBOARD.default} fullWidth={mobile_match}>
                            Reset password
                        </Button>
                    </Group>
                </Paper>
            </AuthLayout>
        </>
    );
}

export default PasswordReset

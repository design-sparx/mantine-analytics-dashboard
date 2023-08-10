import {
    Button,
    Center,
    createStyles,
    Group,
    Paper,
    rem,
    Stack,
    Text,
    TextInput,
    Title,
    UnstyledButton
} from '@mantine/core';
import {IconChevronLeft} from '@tabler/icons-react';
import Head from "next/head";
import React from "react";
import Link from "next/link";
import {PATH_AUTH, PATH_DASHBOARD} from "@/routes";
import {AuthLayout} from "@/layout";

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: rem(26),
        fontWeight: 900,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    controls: {
        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column-reverse',
        },
    },

    control: {
        [theme.fn.smallerThan('xs')]: {
            width: '100%',
            textAlign: 'center',
        },
    },
}));

function PasswordReset() {
    const {classes} = useStyles();

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

                <Paper shadow="xl" p="lg" mt={15} radius="md" sx={{width: rem(460)}}>
                    <TextInput label="Your email" placeholder="me@mantine.dev" required/>
                    <Group position="apart" mt="lg" className={classes.controls}>
                        <UnstyledButton
                            component={Link}
                            href={PATH_AUTH.signin}
                            color="dimmed"
                            className={classes.control}
                        >
                            <Group spacing={2}>
                                <IconChevronLeft size={rem(18)} stroke={1.5}/>
                                <Text size="sm" ml={5}>Back to the login page</Text>
                            </Group>
                        </UnstyledButton>
                        <Button
                            className={classes.control}
                            component={Link} href={PATH_DASHBOARD.default}
                        >
                            Reset password
                        </Button>
                    </Group>
                </Paper>
            </AuthLayout>
        </>
    );
}

export default PasswordReset

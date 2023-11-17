import React from 'react';
import {
    Button, Center,
    Checkbox,
    Group,
    Paper,
    PasswordInput,
    rem,
    Text,
    TextInput, TextProps,
    Title, useMantineTheme,
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import {PATH_AUTH, PATH_DASHBOARD} from "@/routes";
import {AuthLayout} from "@/layout";
import {useMediaQuery} from "@mantine/hooks";

function Signin() {
    const theme = useMantineTheme()
    const mobile_match = useMediaQuery('(max-width: 425px)');

    const LINK_PROPS: TextProps = {
        sx: {
            padding: `${rem(6)} ${rem(10)}`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,

            '&:hover': {
                transition: 'all ease 150ms',
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2],
                color: theme.black,
                textDecoration: 'none'
            }
        }
    }

    return (
        <>
            <Head>
                <title>Signin | DesignSparx</title>
            </Head>
            <AuthLayout>
                <Title ta="center">
                    Welcome back!
                </Title>
                <Text ta="center">Sign in to your account to continue</Text>

                <Paper shadow="xl" radius="md" p="lg" mt={15} sx={{width: rem(mobile_match ? 360 : 420)}}>
                    <TextInput label="Email" placeholder="you@mantine.dev" required/>
                    <PasswordInput label="Password" placeholder="Your password" required mt="md"/>
                    <Group position="apart" mt="lg">
                        <Checkbox label="Remember me"/>
                        <Text component={Link} href={PATH_AUTH.passwordReset} size="sm" {...LINK_PROPS}>
                            Forgot password?
                        </Text>
                    </Group>
                    <Button fullWidth mt="xl" component={Link} href={PATH_DASHBOARD.default}>
                        Sign in
                    </Button>
                    <Center mt="md">
                        <Text fz="sm" ta="center" component={Link} href={PATH_AUTH.signup} {...LINK_PROPS}>
                            Do not have an account yet? Create account
                        </Text>
                    </Center>
                </Paper>
            </AuthLayout>
        </>
    );
}

export default Signin;

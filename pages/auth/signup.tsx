import React from 'react';
import {
    Button,
    Center,
    Flex,
    Paper,
    PasswordInput,
    rem,
    Text,
    TextInput, TextProps,
    Title, useMantineTheme
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import {PATH_AUTH, PATH_DASHBOARD} from "@/routes";
import {AuthLayout} from "@/layout";
import {useMediaQuery} from "@mantine/hooks";

function Signin() {
    const theme = useMantineTheme();
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
                <title>Create account | DesignSparx</title>
            </Head>
            <AuthLayout>
                <Title ta="center">
                    Welcome!
                </Title>
                <Text ta="center">Create your account to continue</Text>

                <Paper
                    shadow="xl"
                    p="lg"
                    mt={15}
                    radius="md"
                    sx={{
                        width: rem(mobile_match ? 360 : 420),
                    }}
                >
                    <Flex
                        direction={{base: 'column', sm: 'row'}}
                        gap={{base: 'md'}}
                    >
                        <TextInput label="First name" placeholder="John" required/>
                        <TextInput label="Last name" placeholder="Doe" required/>
                    </Flex>
                    <TextInput label="Email" placeholder="you@mantine.dev" required mt="md"/>
                    <PasswordInput label="Password" placeholder="Your password" required mt="md"/>
                    <PasswordInput label="Confirm Password" placeholder="Confirm password" required mt="md"/>
                    <Button fullWidth mt="xl" component={Link} href={PATH_DASHBOARD.default}>
                        Create account
                    </Button>
                    <Center mt="md">
                        <Text size="sm" component={Link} href={PATH_AUTH.signin} {...LINK_PROPS}>
                            Already have an account? Sign in
                        </Text>
                    </Center>
                </Paper>
            </AuthLayout>
        </>
    );
}

export default Signin;

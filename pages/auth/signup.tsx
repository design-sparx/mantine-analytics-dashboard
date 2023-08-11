import React from 'react';
import {
    Button,
    Center,
    Flex,
    Paper,
    PasswordInput,
    rem,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import {PATH_AUTH, PATH_DASHBOARD} from "@/routes";
import {AuthLayout} from "@/layout";
import {useMediaQuery} from "@mantine/hooks";

function Signin() {
    const mobile_match = useMediaQuery('(max-width: 425px)');

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

                <Paper shadow="xl" p="lg" mt={15} radius="md" sx={{width: rem(mobile_match ? 360 : 420)}}>
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
                    <Center mt="sm">
                        <Text size="sm" component={Link} href={PATH_AUTH.signin}>
                            Already have an account? Sign in
                        </Text>
                    </Center>
                </Paper>
            </AuthLayout>
        </>
    );
}

export default Signin;

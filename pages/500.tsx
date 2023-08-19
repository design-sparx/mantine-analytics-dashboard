import {Button, Center, createStyles, Group, rem, Stack, Text, Title} from '@mantine/core';
import Head from "next/head";
import React from "react";
import {ErrorLayout} from "@/layout";
import {IconHome2, IconRefresh, IconRefreshDot} from "@tabler/icons-react";
import {useRouter} from "next/router";
import {PATH_ERROR} from "@/routes";

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: rem(80),
        paddingBottom: rem(80),
    },

    label: {
        textAlign: 'center',
        fontWeight: 900,
        fontSize: rem(220),
        lineHeight: 1,
        color: theme.colors[theme.primaryColor][6],

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(120),
        },
    },

    title: {
        textAlign: 'center',
        fontWeight: 900,
        fontSize: rem(38),

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(32),
        },
    },

    description: {
        maxWidth: rem(500),
        margin: 'auto',
    },
}));

function Error500() {
    const {classes} = useStyles();
    const router = useRouter()

    return (
        <>
            <Head>
                <title>Server Error | DesignSparx</title>
            </Head>
            <ErrorLayout>
                <Stack>
                    <div className={classes.label}>500</div>
                    <Title className={classes.title}>Sorry, unexpected error..</Title>
                    <Text fz="md" ta="center" className={classes.description}>
                        Our servers could not handle your request. Don't worry, our development team was already
                        notified. Try refreshing the page.
                    </Text>
                    <Group position="center" mt="md">
                        <Button size="md" leftIcon={<IconRefresh size={18}/>} onClick={() => router.push(PATH_ERROR.error500)}>
                            Refresh Page
                        </Button>
                        <Button size="md" leftIcon={<IconHome2 size={18}/>} onClick={() => router.push('/')}>
                            Take me to home page
                        </Button>
                    </Group>
                </Stack>
            </ErrorLayout>
        </>
    );
}

export default Error500

import {Button, Center, createStyles, Group, rem, Stack, Text, Title} from '@mantine/core';
import Head from "next/head";
import React from "react";
import Link from "next/link";
import {PATH_DASHBOARD} from "@/routes";
import {ErrorLayout} from "@/layout";
import {IconChevronLeft, IconHome2} from "@tabler/icons-react";
import {useRouter} from "next/router";

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
        color: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.dark[2],

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

function Error404() {
    const {classes} = useStyles();
    const router = useRouter()

    return (
        <>
            <Head>
                <title>Page Not Found | DesignSparx</title>
            </Head>
            <ErrorLayout>
                <Stack>
                    <div className={classes.label}>404</div>
                    <Title className={classes.title}>You have found a secret place.</Title>
                    <Text fz="md" ta="center" className={classes.description}>
                        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
                        been moved to another URL.
                    </Text>
                    <Group position="center" mt="md">
                        <Button
                            size="md"
                            leftIcon={<IconChevronLeft size={18}/>}
                            onClick={() => {
                                router.back()
                            }}
                        >
                            Go back
                        </Button>
                        <Button
                            size="md"
                            component={Link}
                            leftIcon={<IconHome2 size={18}/>}
                            href={PATH_DASHBOARD.default}
                        >
                            Take me to home page
                        </Button>
                    </Group>
                </Stack>
            </ErrorLayout>
        </>
    );
}

export default Error404

import {Button, createStyles, Group, rem, Stack, Text, Title} from '@mantine/core';
import Head from "next/head";
import React from "react";
import {ErrorLayout} from "@/layout";
import {IconChevronLeft} from "@tabler/icons-react";
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
        color: theme.colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[0],

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

function Error403() {
    const {classes} = useStyles();
    const router = useRouter()

    return (
        <>
            <Head>
                <title>Access Denied | DesignSparx</title>
            </Head>
            <ErrorLayout>
                <Stack>
                    <div className={classes.label}>403</div>
                    <Title className={classes.title}>Access Denied.</Title>
                    <Text fz="md" ta="center" className={classes.description}>
                        The page you're trying to access has restricted access. Please refer to your system
                        administrator.
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
                    </Group>
                </Stack>
            </ErrorLayout>
        </>
    );
}

export default Error403

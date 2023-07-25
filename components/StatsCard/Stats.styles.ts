import {createStyles, rem} from "@mantine/core";

export default createStyles((theme) => ({
    value: {
        fontSize: rem(24),
        fontWeight: 500,
        lineHeight: 1,
    },

    diff: {
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
    },

    icon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
    },

    title: {
        fontWeight: 500,
        textTransform: 'uppercase',
    },
}));

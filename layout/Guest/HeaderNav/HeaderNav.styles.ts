import {createStyles, rem} from "@mantine/core";

const HEADER_HEIGHT = rem(60);

export default createStyles((theme) => ({
    inner: {
        backgroundColor: theme.black,
        color: theme.white,
        height: HEADER_HEIGHT,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    links: {
        textTransform: 'capitalize',

        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'flex',
        alignItems: 'center',
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.white,
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
        height: 38,
        textTransform: 'capitalize',

        '&:hover': {
            transition: 'all ease 150ms',
            backgroundColor: theme.colors.dark[5],
        },

        [theme.fn.smallerThan('sm')]: {
            color: theme.black,
        },
    },

    linkLabel: {
        marginRight: rem(5),
    },

    hiddenMobile: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    hiddenDesktop: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },
}));

import {createStyles, rem} from "@mantine/core";

export default createStyles((theme) => ({
    navbar: {
        backgroundColor: theme.colors[theme.primaryColor][7],
        paddingBottom: 0,
        border: 'none'
    },

    header: {
        padding: theme.spacing.md,
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
        backgroundColor: theme.colors[theme.primaryColor][8],
        color: theme.white,
        borderBottom: `${rem(1)} solid transparent`,
    },

    links: {
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
    },

    linksInner: {
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
    },

    footer: {
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
        borderTop: `${rem(1)} solid transparent`,
    },
}));

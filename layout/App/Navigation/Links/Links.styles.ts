import {createStyles, rem} from "@mantine/core";

export default createStyles((theme) => ({
    control: {
        fontWeight: 500,
        display: 'block',
        width: '100%',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        color: theme.white,
        fontSize: theme.fontSizes.sm,

        '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][8],
        },
    },

    link: {
        fontWeight: 500,
        display: 'block',
        textDecoration: 'none',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        paddingLeft: rem(31),
        marginLeft: rem(30),
        fontSize: theme.fontSizes.sm,
        color: theme.white,
        borderLeft: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,

        '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][8],
        },
    },

    chevron: {
        transition: 'transform 200ms ease',
    },
}));

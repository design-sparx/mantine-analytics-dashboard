import {createStyles, rem} from "@mantine/core";

export default createStyles((theme) => ({
    logo: {
        padding: `${rem(4)} ${rem(8)}`,
        fontSize: theme.fontSizes.md,
        borderRadius: theme.radius.md,
        fontWeight: 600,

        '&:hover': {
            transition: 'all ease 150ms',
            fontWeight: 800,
        }
    }
}))

import {createStyles, rem} from "@mantine/core";

export default createStyles((theme) => ({
    item: {
        padding: `${theme.spacing.xs}`,
        borderBottom: `1px solid ${theme.colors.gray[3]}`,

        '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][0]
        }
    },
    itemRounded: {
        padding: `${theme.spacing.xs}`,
        borderRadius: theme.radius.md,

        '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][0]
        }
    }
}))
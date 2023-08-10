import {createStyles, rem} from "@mantine/core";

export default createStyles((theme) => ({
    item: {
        padding: `${theme.spacing.xs}`,
        borderBottom: `1px solid ${theme.colors.gray[3]}`,

        '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][0]
        }
    }
}))
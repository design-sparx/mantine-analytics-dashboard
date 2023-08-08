import {createStyles} from "@mantine/core";

export default createStyles((theme) => ({
    user: {
        display: 'block',
        width: '100%',
        padding: theme.spacing.md,

        '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][8],
        },
    },
}));

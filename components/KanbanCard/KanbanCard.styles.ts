import {createStyles} from "@mantine/core";

export default createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        border: `1px solid transparent`,
        paddingBottom: 0,

        '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][0],
            borderColor: theme.colors[theme.primaryColor][7],
        },
    },
}));

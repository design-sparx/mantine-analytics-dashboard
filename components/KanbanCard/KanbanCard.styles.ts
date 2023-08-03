import {createStyles} from "@mantine/core";

export default createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        paddingBottom: 0,

        '&:hover': {
            borderColor: theme.colors.gray[6],
        },
    },
}));

import {createStyles, rem} from "@mantine/core";

export default createStyles((theme) => ({
    footer: {
        backgroundColor: theme.black,
        color: theme.white,
        paddingTop: `calc(${theme.spacing.xl} * 2)`,
        paddingBottom: `calc(${theme.spacing.xl} * 1)`,
        paddingLeft: `calc(${theme.spacing.xl} * 1)`,
        paddingRight: `calc(${theme.spacing.xl} * 1)`,
    }
}));

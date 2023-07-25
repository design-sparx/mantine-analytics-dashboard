import {createStyles, rem} from "@mantine/core";

export default createStyles((theme, { opened }: { opened: boolean }) => ({
  control: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: rem(4),
    borderRadius: theme.radius.sm,
    transition: "background-color 150ms ease",
    color: theme.black,

    "&:hover": {
      backgroundColor:
          theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[1],
    },
  },

  label: {
    fontWeight: 600,
    fontSize: theme.fontSizes.sm,
  },

  icon: {
    transition: "transform 150ms ease",
    transform: opened ? "rotate(180deg)" : "rotate(0deg)",
  },
}))

import {ReactNode} from "react";
import {Box, useMantineTheme} from "@mantine/core";
import HeaderNav from "@/layout/Guest/HeaderNav/HeaderNav";
import FooterNav from "@/layout/Guest/FooterNav/FooterNav";

type GuestLayoutProps = {
  children: ReactNode
}

function GuestLayout({children}: GuestLayoutProps) {
  const theme = useMantineTheme()

  return (
    <>
      <HeaderNav/>
      <Box
        style={{backgroundColor: theme.colors.gray[0]}}
      >
        {children}
      </Box>
      <FooterNav/>
    </>
  );
}

export default GuestLayout;

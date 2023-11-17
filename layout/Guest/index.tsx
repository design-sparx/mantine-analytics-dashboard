import HeaderNav from "@/layout/Guest/HeaderNav/HeaderNav";
import React, {ReactNode} from "react";
import {Box, MantineProvider, useMantineTheme} from "@mantine/core";
import FooterNav from "@/layout/Guest/FooterNav/FooterNav";

type GuestLayoutProps = {
    children: ReactNode
}

const GuestLayout = ({children}: GuestLayoutProps) => {
    const theme = useMantineTheme()

    return (
        <MantineProvider theme={{primaryShade: 8}}>
            <HeaderNav/>
            <Box
                style={{backgroundColor: theme.colors.gray[0]}}
            >
                {children}
            </Box>
            <FooterNav/>
        </MantineProvider>
    );
};

export default GuestLayout;

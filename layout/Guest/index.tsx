import HeaderNav from "@/layout/Guest/HeaderNav/HeaderNav";
import React, {ReactNode} from "react";
import {
    ActionIcon,
    Box,
    Button,
    Container,
    Divider,
    Flex,
    Group,
    MantineProvider,
    Text,
    Title,
    useMantineTheme
} from "@mantine/core";
import {Logo} from "@/components";
import {
    IconBrandFacebook,
    IconBrandGithub,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconWorld
} from "@tabler/icons-react";
import FooterNav from "@/layout/Guest/FooterNav/FooterNav";

type GuestLayoutProps = {
    children: ReactNode
}

const GuestLayout = ({children}: GuestLayoutProps) => {
    const theme = useMantineTheme()

    return (
        <MantineProvider inherit theme={{primaryShade: 8}}>
            <HeaderNav/>
            <Box
                sx={{backgroundColor: theme.colors.gray[0]}}
            >
                {children}
            </Box>
            <FooterNav/>
        </MantineProvider>
    );
};

export default GuestLayout;

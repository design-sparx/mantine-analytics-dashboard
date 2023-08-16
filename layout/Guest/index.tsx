import HeaderNav from "@/layout/Guest/HeaderNav/HeaderNav";
import React, {ReactNode} from "react";
import {ActionIcon, Button, Container, Divider, Flex, Group, MantineProvider, Text, Title} from "@mantine/core";
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
    return (
        <MantineProvider inherit theme={{primaryShade: 8}}>
            <HeaderNav/>
            {children}
            <FooterNav/>
        </MantineProvider>
    );
};

export default GuestLayout;

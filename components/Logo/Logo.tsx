import React from 'react';
import classes from "./Logo.module.css";
import {Group, Text, UnstyledButton, UnstyledButtonProps} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  href?: string
} & UnstyledButtonProps

const Logo = ({href, ...others}: LogoProps) => {
  return (
    <UnstyledButton className={classes.logo} component={Link} href={href || "/"} {...others}>
      <Group spacing="xs">
        <Image src="/logo.png" height={24} width={24} alt="design sparx logo"/>
        <Text>Design Sparx</Text>
      </Group>
    </UnstyledButton>
  );
};

export default Logo;

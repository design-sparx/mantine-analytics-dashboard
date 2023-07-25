import React from 'react';
import useStyles from "./Logo.styles";
import {Text, TextProps} from "@mantine/core";
import Link from "next/link";

type LogoProps = TextProps

const Logo = ({...others}: LogoProps) => {
    const {classes} = useStyles();

    return (
        <Text component={Link} href="/" className={classes.logo} {...others}>
            Sparx
        </Text>
    );
};

export default Logo;

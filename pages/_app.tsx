import type {AppProps} from 'next/app'
import Head from "next/head";
import {ColorScheme, ColorSchemeProvider, MantineProvider} from '@mantine/core';
import {useEffect, useState} from "react";
import {getCookie, setCookie} from 'cookies-next';
import {GetServerSidePropsContext} from "next";
import "../styles/globals.css";
import {useColorScheme} from "@mantine/hooks";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
    const {Component, pageProps} = props;
    const preferredColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);

    const toggleColorScheme = (value?: ColorScheme): void =>
        setColorScheme(value ?? (colorScheme === 'dark' ? 'light' : 'dark'));

    return <>
        <Head>
            <title>Page title</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
        </Head>

        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme,
                    fontFamily: 'Manrope, sans-serif',
                    headings: {
                        fontFamily: 'Manrope, sans-serif'
                    }
                }}
            >
                <Component {...pageProps} />
            </MantineProvider>
        </ColorSchemeProvider>
    </>
}

App.getInitialProps = ({ctx}: { ctx: GetServerSidePropsContext }) => ({
    // get color scheme from cookie
    colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});

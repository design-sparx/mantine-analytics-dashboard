import {Box, Code, Group, Navbar, NavbarProps, ScrollArea, Text} from '@mantine/core';
import {
    IconAdjustmentsFilled,
    IconAlertOctagon,
    IconAppWindow, IconBook2,
    IconBriefcase,
    IconCalendar,
    IconFileInvoice, IconLifebuoy, IconList,
    IconListDetails,
    IconUserShield,
} from '@tabler/icons-react';
import useStyles from "./Navigation.styles";
import {LinksGroup} from "@/layout/Navigation/Links/Links";
import {Logo} from "@/components";

const mockdata = [
    {
        title: 'Pages',
        links: [
            {
                label: 'Dashboard',
                icon: IconAdjustmentsFilled,
                links: [
                    {label: 'Default', link: "/"},
                    {label: 'Analytics', link: "/"},
                    {label: 'SaaS', link: "/"},
                ]
            },
            {
                label: 'Pages',
                icon: IconAppWindow,
                links: [
                    {label: 'Profile', link: "/"},
                    {label: 'Settings', link: "/"},
                    {label: 'Pricing', link: "/"},
                    {label: 'Chat', link: "/"},
                    {label: 'Blank Page', link: "/"},
                ]
            },
            {label: 'Projects', icon: IconBriefcase},
            {label: 'Orders', icon: IconListDetails},
            {
                label: 'Invoices',
                icon: IconFileInvoice,
                links: [
                    {label: 'List', link: "/"},
                    {label: 'Details', link: "/"},
                ]
            },
            {label: 'Tasks', icon: IconListDetails},
            {label: 'Calendar', icon: IconCalendar},
            {
                label: 'Auth',
                icon: IconUserShield,
                links: [
                    {label: 'Sign In', link: "/"},
                    {label: 'Sign Up', link: "/"},
                    {label: 'Reset Password', link: "/"},
                    {label: '404 Page', link: "/"},
                    {label: '500 Page', link: "/"},
                ]
            },
            {
                label: 'Errors',
                icon: IconAlertOctagon,
                links: [
                    {label: '403 Page', link: "/"},
                    {label: '404 Page', link: "/"},
                    {label: '500 Page', link: "/"},
                ]
            },
        ]
    },
    {
        title: 'Documentation',
        links: [
            {label: 'Getting started', icon: IconLifebuoy,},
            {label: 'Documentation', icon: IconBook2,},
            {label: 'Changelog', icon: IconList,},
        ]
    }
];

type NavigationProps = Omit<NavbarProps, 'children'>

const Navigation = ({...others}: NavigationProps) => {
    const {classes} = useStyles()
    const links = mockdata.map(m => <Box pl="md" mb="md" key={m.title}>
        <Text tt="uppercase" color="dimmed" size="xs" pl="md" fw={500} mb="sm">{m.title}</Text>
        {m.links.map((item) => <LinksGroup {...item} key={item.label}/>)}
    </Box>)

    return (
        <Navbar width={{sm: 300}} p="md" className={classes.navbar} {...others}>
            <Navbar.Section className={classes.header}>
                <Group position="apart">
                    <Logo size={36}/>
                    <Code sx={{fontWeight: 700}}>v3.1.2</Code>
                </Group>
            </Navbar.Section>

            <Navbar.Section grow className={classes.links} component={ScrollArea}>
                <div className={classes.linksInner}>{links}</div>
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                User
            </Navbar.Section>
        </Navbar>
    );
};

export default Navigation;

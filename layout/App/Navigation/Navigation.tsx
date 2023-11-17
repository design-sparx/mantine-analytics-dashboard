import {ActionIcon, AppShell, Box, Code, Flex, Group, ScrollArea, Text, useMantineTheme} from '@mantine/core';
import {
  IconAdjustmentsFilled,
  IconAlertOctagon,
  IconAppWindow,
  IconBook2,
  IconBriefcase,
  IconCalendar,
  IconFileInvoice,
  IconLifebuoy,
  IconList,
  IconListDetails,
  IconUserShield,
  IconX,
} from '@tabler/icons-react';
import {Logo, UserProfileButton} from "@/components";
import {
  PATH_AUTH,
  PATH_CALENDAR,
  PATH_DASHBOARD,
  PATH_DOCS,
  PATH_ERROR,
  PATH_INVOICES,
  PATH_ORDERS,
  PATH_PAGES,
  PATH_PROJECTS,
  PATH_TASKS
} from "@/routes";
import UserProfileData from ".././../../mocks/UserProfile.json";
import {LinksGroup} from "@/layout/App/Navigation/Links/Links";
import {useMediaQuery} from "@mantine/hooks";
import classes from "./Navigation.module.css";

const mockdata = [
  {
    title: 'Pages',
    links: [
      {
        label: 'Dashboard',
        icon: IconAdjustmentsFilled,
        links: [
          {label: 'Default', link: PATH_DASHBOARD.default},
          {label: 'Analytics', link: PATH_DASHBOARD.analytics},
          {label: 'SaaS', link: PATH_DASHBOARD.saas},
        ]
      },
      {
        label: 'Pages',
        icon: IconAppWindow,
        links: [
          {label: 'Profile', link: PATH_PAGES.profile},
          {label: 'Settings', link: PATH_PAGES.settings},
          {label: 'Pricing', link: PATH_PAGES.pricing},
          {label: 'Chat', link: PATH_PAGES.chat},
          {label: 'Blank Page', link: PATH_PAGES.blank},
        ]
      },
      {label: 'Projects', icon: IconBriefcase, link: PATH_PROJECTS.root},
      {label: 'Orders', icon: IconListDetails, link: PATH_ORDERS.root},
      {
        label: 'Invoices',
        icon: IconFileInvoice,
        links: [
          {label: 'List', link: PATH_INVOICES.invoices.all},
          {label: 'Details', link: PATH_INVOICES.invoices.sample},
        ]
      },
      {label: 'Tasks', icon: IconListDetails, link: PATH_TASKS.root},
      {label: 'Calendar', icon: IconCalendar, link: PATH_CALENDAR.root},
      {
        label: 'Auth',
        icon: IconUserShield,
        links: [
          {label: 'Sign In', link: PATH_AUTH.signin},
          {label: 'Sign Up', link: PATH_AUTH.signup},
          {label: 'Reset Password', link: PATH_AUTH.passwordReset},
        ]
      },
      {
        label: 'Errors',
        icon: IconAlertOctagon,
        links: [
          {label: '403 Page', link: PATH_ERROR.error403},
          {label: '404 Page', link: PATH_ERROR.error404},
          {label: '500 Page', link: PATH_ERROR.error500},
        ]
      },
    ]
  },
  {
    title: 'Documentation',
    links: [
      {
        label: 'Getting started',
        icon: IconLifebuoy,
        link: PATH_DOCS.root
      },
      {
        label: 'Documentation',
        icon: IconBook2,
        link: PATH_DOCS.root
      },
      {label: 'Changelog', icon: IconList,},
    ]
  }
];

type NavigationProps = {
  onClose: () => void
}

const Navigation = ({onClose, ...others}: NavigationProps) => {
  const theme = useMantineTheme()
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const links = mockdata.map(m =>
    <Box pl={0} mb="md" key={m.title}>
      <Text tt="uppercase" size="xs" pl="md" fw={500} mb="sm" className={classes.linkHeader}>{m.title}</Text>
      {m.links.map((item) => <LinksGroup {...item} key={item.label}/>)}
    </Box>
  )

  return (
    <>
      <AppShell.Section className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm" p="md">
          <Group justify="space-between" style={{flex: tablet_match ? 'auto' : 1}}>
            <Logo/>
            <Code
              style={{
                fontWeight: 700,
                backgroundColor: theme.colors[theme.primaryColor][9],
                color: theme.white
              }}
            >
              v1.0.0
            </Code>
          </Group>
          {tablet_match &&
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX color="white"/>
            </ActionIcon>
          }
        </Flex>
      </AppShell.Section>

      <AppShell.Section grow className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </AppShell.Section>

      <AppShell.Section className={classes.footer}>
        <UserProfileButton
          email={UserProfileData.email}
          image={UserProfileData.avatar}
          name={UserProfileData.name}
          style={{color: theme.white}}
        />
      </AppShell.Section>
    </>
  );
};

export default Navigation;

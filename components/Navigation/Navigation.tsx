import { useEffect } from 'react';

import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBook2,
  IconBrandAuth0,
  IconBriefcase,
  IconCalendar,
  IconChartArcs3,
  IconChartBar,
  IconChartInfographic,
  IconExclamationCircle,
  IconFileInvoice,
  IconFiles,
  IconLayersSubtract,
  IconLifebuoy,
  IconList,
  IconListDetails,
  IconLogin2,
  IconMessages,
  IconPackages,
  IconReceipt2,
  IconRotateRectangle,
  IconUserCircle,
  IconUserCode,
  IconUserPlus,
  IconUserShield,
  IconX,
} from '@tabler/icons-react';

import { SidebarState } from '@/app/apps/layout';
import { Logo, UserProfileButton } from '@/components';
import { LinksGroup } from '@/components/Navigation/Links/Links';
import UserProfileData from '@/public/mocks/UserProfile.json';
import {
  PATH_ABOUT,
  PATH_APPS,
  PATH_AUTH,
  PATH_DASHBOARD,
  PATH_DOCS,
  PATH_PAGES,
} from '@/routes';

import classes from './Navigation.module.css';

const mockdata = [
  {
    title: 'Dashboard',
    links: [
      { label: 'Default', icon: IconChartBar, link: PATH_DASHBOARD.default },
      {
        label: 'Analytics',
        icon: IconChartInfographic,
        link: PATH_DASHBOARD.analytics,
      },
      { label: 'SaaS', icon: IconChartArcs3, link: PATH_DASHBOARD.saas },
    ],
  },
  {
    title: 'Apps',
    links: [
      { label: 'Profile', icon: IconUserCircle, link: PATH_APPS.profile },
      { label: 'Settings', icon: IconUserCode, link: PATH_APPS.settings },
      { label: 'Chat', icon: IconMessages, link: PATH_APPS.chat },
      { label: 'Projects', icon: IconBriefcase, link: PATH_APPS.projects },
      { label: 'Orders', icon: IconListDetails, link: PATH_APPS.orders },
      {
        label: 'Invoices',
        icon: IconFileInvoice,
        links: [
          {
            label: 'List',
            link: PATH_APPS.invoices.root,
          },
          {
            label: 'Details',
            link: PATH_APPS.invoices.sample,
          },
        ],
      },
      { label: 'Tasks', icon: IconListDetails, link: PATH_APPS.tasks },
      { label: 'Calendar', icon: IconCalendar, link: PATH_APPS.calendar },
      {
        label: 'File Manager',
        icon: IconFiles,
        link: PATH_APPS.fileManager.root,
      },
      {
        label: 'Products',
        icon: IconPackages,
        links: [
          { label: 'List', link: PATH_APPS.products.root },
          { label: 'Categories', link: PATH_APPS.products.categories },
        ],
      },
    ],
  },
  {
    title: 'Auth',
    links: [
      { label: 'Sign In', icon: IconLogin2, link: PATH_AUTH.signin },
      { label: 'Sign Up', icon: IconUserPlus, link: PATH_AUTH.signup },
      {
        label: 'Reset Password',
        icon: IconRotateRectangle,
        link: PATH_AUTH.passwordReset,
      },
      { label: 'Clerk', icon: IconUserShield, link: PATH_AUTH.clerk },
      { label: 'Auth0', icon: IconBrandAuth0, link: PATH_AUTH.auth0 },
    ],
  },
  {
    title: 'Pages',
    links: [
      { label: 'Pricing', icon: IconReceipt2, link: PATH_PAGES.pricing },
      { label: 'Blank Page', icon: IconLayersSubtract, link: PATH_PAGES.blank },
    ],
  },
  {
    title: 'Documentation',
    links: [
      {
        label: 'About',
        icon: IconExclamationCircle,
        link: PATH_ABOUT.root,
      },
      {
        label: 'Getting started',
        icon: IconLifebuoy,
        link: PATH_DOCS.root,
      },
      {
        label: 'Documentation',
        icon: IconBook2,
        link: PATH_DOCS.root,
      },
      { label: 'Changelog', icon: IconList },
    ],
  },
];

type NavigationProps = {
  onClose: () => void;
  sidebarState: SidebarState;
  onSidebarStateChange: (state: SidebarState) => void;
};

const Navigation = ({
  onClose,
  onSidebarStateChange,
  sidebarState,
}: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const links = mockdata.map((m) => (
    <Box key={m.title} pl={0} mb={sidebarState === 'mini' ? 0 : 'md'}>
      {sidebarState !== 'mini' && (
        <Text
          tt="uppercase"
          size="xs"
          pl="md"
          fw={500}
          mb="sm"
          className={classes.linkHeader}
        >
          {m.title}
        </Text>
      )}
      {m.links.map((item) => (
        <LinksGroup
          key={item.label}
          {...item}
          isMini={sidebarState === 'mini'}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
    </Box>
  ));

  useEffect(() => {
    if (tablet_match) {
      onSidebarStateChange('full');
    }
  }, [onSidebarStateChange, tablet_match]);

  return (
    <div className={classes.navbar} data-sidebar-state={sidebarState}>
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group
            justify={sidebarState === 'mini' ? 'center' : 'space-between'}
            style={{ flex: tablet_match ? 'auto' : 1 }}
          >
            <Logo className={classes.logo} showText={sidebarState !== 'mini'} />
          </Group>
          {tablet_match && (
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX color="white" />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner} data-sidebar-state={sidebarState}>
          {links}
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserProfileButton
          email={UserProfileData.email}
          image={UserProfileData.avatar}
          name={UserProfileData.name}
          showText={sidebarState !== 'mini'}
        />
      </div>
    </div>
  );
};

export default Navigation;

import { useEffect } from 'react';

import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';

import { SidebarState } from '@/app/apps/layout';
import { Logo, UserProfileButton } from '@/components';
import { SIDEBAR_LINKS } from '@/constants/sidebar-links';
import { useSidebarConfig } from '@/contexts/ThemeCustomizerContext';
import { useAuth } from '@/hooks/useAuth';
import UserProfileData from '@/public/mocks/UserProfile.json';

import { LinksGroup } from '../NavLinks';
import classes from './Sidebar.module.css';

type NavigationProps = {
  onClose: () => void;
  sidebarState: SidebarState;
  onSidebarStateChange: (state: SidebarState) => void;
};

const SidebarNav = ({
  onClose,
  onSidebarStateChange,
  sidebarState,
}: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const sidebarConfig = useSidebarConfig();
  const { user } = useAuth();

  const links = SIDEBAR_LINKS.map((m) => (
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
    <div
      className={classes.navbar}
      data-sidebar-state={sidebarState}
      data-variant={sidebarConfig.variant}
      data-position={sidebarConfig.position}
    >
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
          email={user?.email ?? UserProfileData.email}
          image={user?.image ?? UserProfileData.avatar}
          name={user?.userName ?? UserProfileData.name}
          showText={sidebarState !== 'mini'}
          p={0}
        />
      </div>
    </div>
  );
};

export default SidebarNav;

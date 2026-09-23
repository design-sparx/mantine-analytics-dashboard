import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';

import { Logo } from '@/components';
import { SIDEBAR_LINKS } from '@/constants/sidebar-links';

import { LinksGroup } from '../NavLinks';
import classes from './Sidebar.module.css';

type NavigationProps = {
  onClose: () => void;
  showCloseButton?: boolean;
};

const SidebarNav = ({ onClose, showCloseButton = false }: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const sidebarVariant: 'default' | 'colored' | 'gradient' | 'glassmorphism' = 'default';
  const sidebarPosition: 'left' | 'right' = 'left';

  const links = SIDEBAR_LINKS.map((m) => (
    <Box key={m.title} pl={0} mb="md">
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
      {m.links.map((item) => (
        <LinksGroup
          key={item.label}
          {...item}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
    </Box>
  ));

  const sidebarVariantValue = sidebarVariant as 'default' | 'colored' | 'gradient' | 'glassmorphism';
  const sidebarPositionValue = sidebarPosition as 'left' | 'right';

  // Determine close button color based on sidebar variant
  const getCloseButtonColor = () => {
    if (sidebarVariantValue === 'colored') {
      return 'white';
    }
    return undefined; // Use default color
  };

  return (
    <div
      className={classes.navbar}
      data-variant={sidebarVariantValue}
      data-position={sidebarPositionValue}
    >
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group
            justify="space-between"
            style={{ flex: tablet_match ? 'auto' : 1 }}
          >
            <Logo className={classes.logo} showText={true} />
          </Group>
          {showCloseButton && (
            <ActionIcon onClick={onClose} variant="transparent" size="sm">
              <IconX color={getCloseButtonColor()} size={18} />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>
    </div>
  );
};

export default SidebarNav;

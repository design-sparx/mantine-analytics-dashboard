'use client';

import {
  ActionIcon,
  Avatar,
  Burger,
  Flex,
  Group,
  Indicator,
  Menu,
  Stack,
  Text,
  TextInput,
  Tooltip,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBell,
  IconCircleHalf2,
  IconMessageCircle,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
} from '@tabler/icons-react';

import { SidebarState } from '@/app/apps/layout';
import { LanguagePicker } from '@/components';
import { MESSAGES } from '@/constants/messages';
import { NOTIFICATIONS } from '@/constants/notifications';
import { HeaderVariant } from '@/contexts/ThemeCustomizerContext';
import { useAuth } from '@/hooks/useAuth';

const ICON_SIZE = 20;

type HeaderNavProps = {
  mobileOpened?: boolean;
  toggleMobile?: () => void;
  sidebarState: SidebarState;
  onSidebarStateChange: () => void;
  headerVariant: HeaderVariant;
};

const HeaderNav = (props: HeaderNavProps) => {
  const { toggleMobile, mobileOpened, headerVariant } = props;
  const theme = useMantineTheme();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 425px)');
  const { user, logout } = useAuth();

  // Determine text color based on header variant
  const getTextColor = () => {
    if (headerVariant === 'colored') {
      return 'white';
    }
    return undefined; // Use default theme colors
  };

  const textColor = getTextColor();

  const messages = MESSAGES.map((m) => (
    <Menu.Item
      key={m.id}
      style={{
        borderBottom: `1px solid ${
          colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[3]
        }`,
      }}
    >
      <Flex gap="sm" align="center">
        <Avatar
          src={null}
          alt={`${m.first_name} ${m.last_name}`}
          variant="filled"
          size="sm"
          color={theme.colors[theme.primaryColor][7]}
        >
          {Array.from(m.first_name)[0]}
          {Array.from(m.last_name)[0]}
        </Avatar>
        <Stack gap={1}>
          <Text fz="sm" fw={600}>
            {m.first_name} {m.last_name}
          </Text>
          <Text lineClamp={2} fz="xs" c="dimmed">
            {m.message}
          </Text>
        </Stack>
      </Flex>
    </Menu.Item>
  ));

  const notifications = NOTIFICATIONS.slice(0, 3).map((n) => (
    <Menu.Item
      key={n.id}
      style={{
        borderBottom: `1px solid ${
          colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[3]
        }`,
      }}
    >
      <Flex gap="sm" align="center">
        <Avatar src={n.icon} alt={n.title} variant="filled" size="sm" />
        <Stack gap={1}>
          <Text fz="sm" fw={600}>
            {n.title}
          </Text>
          <Text lineClamp={2} fz="xs" c="dimmed">
            {n.message}
          </Text>
        </Stack>
      </Flex>
    </Menu.Item>
  ));

  return (
    <Group justify="space-between">
      <Group gap={0}>
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="md"
          size="sm"
          color={textColor}
        />
        {!mobile_match && (
          <TextInput
            placeholder="search"
            rightSection={<IconSearch size={ICON_SIZE} />}
            ml="md"
            style={{
              width: tablet_match ? 'auto' : rem(400),
              '--input-color': textColor || undefined,
            }}
          />
        )}
      </Group>
      <Group>
        {mobile_match && (
          <ActionIcon
            variant={headerVariant === 'colored' ? 'transparent' : 'default'}
          >
            <IconSearch size={ICON_SIZE} color={textColor} />
          </ActionIcon>
        )}
        <LanguagePicker type="collapsed" />
        <Menu shadow="lg" width={320}>
          <Menu.Target>
            <Indicator processing size={10} offset={6}>
              <Tooltip label="Messages">
                <ActionIcon
                  size="lg"
                  title="Messages"
                  variant={
                    headerVariant === 'colored' ? 'transparent' : 'default'
                  }
                >
                  <IconMessageCircle size={ICON_SIZE} color={textColor} />
                </ActionIcon>
              </Tooltip>
            </Indicator>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              {MESSAGES.length} new messages
            </Menu.Label>
            {messages}
            <Menu.Item tt="uppercase" ta="center" fw={600}>
              Show all messages
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Menu shadow="lg" width={320}>
          <Menu.Target>
            <Indicator processing size={10} offset={6}>
              <Tooltip label="Notifications">
                <ActionIcon
                  size="lg"
                  title="Notifications"
                  variant={
                    headerVariant === 'colored' ? 'transparent' : 'default'
                  }
                >
                  <IconBell size={ICON_SIZE} color={textColor} />
                </ActionIcon>
              </Tooltip>
            </Indicator>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              {NOTIFICATIONS.length} new notifications
            </Menu.Label>
            {notifications}
            <Menu.Item tt="uppercase" ta="center" fw={600}>
              Show all notifications
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Tooltip label="Logout">
          <ActionIcon
            onClick={logout}
            variant={headerVariant === 'colored' ? 'transparent' : 'default'}
          >
            <IconPower size={ICON_SIZE} color={textColor} />
          </ActionIcon>
        </Tooltip>
        <Menu shadow="lg" width={200}>
          <Menu.Target>
            <Tooltip label="Switch color modes">
              <ActionIcon
                variant={headerVariant === 'colored' ? 'transparent' : 'light'}
              >
                {colorScheme === 'auto' ? (
                  <IconCircleHalf2 size={ICON_SIZE} color={textColor} />
                ) : colorScheme === 'dark' ? (
                  <IconMoonStars size={ICON_SIZE} color={textColor} />
                ) : (
                  <IconSunHigh size={ICON_SIZE} color={textColor} />
                )}
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              Select color modes
            </Menu.Label>
            <Menu.Item
              leftSection={<IconSunHigh size={16} />}
              onClick={() => setColorScheme('light')}
            >
              Light
            </Menu.Item>
            <Menu.Item
              leftSection={<IconMoonStars size={16} />}
              onClick={() => setColorScheme('dark')}
            >
              Dark
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default HeaderNav;

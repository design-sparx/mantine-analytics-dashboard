import {
  ActionIcon,
  Button,
  ButtonProps,
  Group,
  Menu,
  Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDots } from '@tabler/icons-react';

import { PATH_GITHUB } from '@/routes';

const FooterNav = () => {
  const mobile_match = useMediaQuery('(max-width: 425px)');

  const BUTTON_PROPS: ButtonProps = {
    variant: 'subtle',
    size: 'compact-md',
  };

  return (
    <Group justify="space-between">
      {mobile_match ? (
        <Menu shadow="md" width={200} position="right-end">
          <Menu.Target>
            <ActionIcon>
              <IconDots size={18} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>Support</Menu.Item>
            <Menu.Item>Help Center</Menu.Item>
            <Menu.Item>Privacy</Menu.Item>
            <Menu.Item>Terms of Use</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Group gap={4}>
          <Button {...BUTTON_PROPS}>Support</Button>
          <Button {...BUTTON_PROPS}>Help Center</Button>
          <Button {...BUTTON_PROPS}>Privacy</Button>
          <Button {...BUTTON_PROPS}>Terms of Use</Button>
        </Group>
      )}
      <Text component="a" href={PATH_GITHUB.org} target="_blank">
        &copy;&nbsp;{new Date().getFullYear()}&nbsp;DesignSparx
      </Text>
    </Group>
  );
};

export default FooterNav;

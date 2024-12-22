import {
  ActionIcon,
  ActionIconProps,
  Container,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconWorld,
} from '@tabler/icons-react';

import { Logo } from '@/components';


import classes from './FooterNav.module.css';

const ICON_SIZE = 18;

const ACTION_ICON_PROPS: ActionIconProps = {
  size: 'lg',
  color: 'primary.3',
  variant: 'transparent',
};

const FooterNav = () => {
  const mobile_match = useMediaQuery('(max-width: 425px)');

  return (
    <footer className={classes.footer}>
      <Container fluid mb="xl">
        <Stack gap="lg">
          <Title ta="center" order={2}>
            Start building with Mantine Admin today
          </Title>
          <Text ta="center">
            Stop wasting time building your application from scratch. Mantine
            Admin is fast, extendable and fully customizable.
          </Text>
          <Group justify="center">
            <Text ta="center">
              ⭐ Give a star to help maintain this project!{' '}
            </Text>
            <iframe
              src="https://ghbtns.com/github-btn.html?user=design-sparx&repo=mantine-analytics-dashboard&type=star&count=true&size=large"
              frameBorder="0"
              scrolling="0"
              width="140"
              height="30"
              title="GitHub"
            />
          </Group>
          <Text ta="center">👨‍💻 Happy Hacking!</Text>
        </Stack>
        <Divider mt="xl" mb="md" />
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'sm', sm: 'lg' }}
          justify={{ base: 'center', sm: 'space-between' }}
          align={{ base: 'center' }}
        >
          <Logo c="white" />
          <Group gap="xs" justify="flex-end" wrap="nowrap">
            <ActionIcon
              component="a"
              href="https://kelvinkiprop.netlify.app/"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconWorld size={ICON_SIZE} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              component="a"
              href="https://github.com/kelvink96"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconBrandGithub size={ICON_SIZE} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              component="a"
              href="https://twitter.com/kelvink_96"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconBrandTwitter size={ICON_SIZE} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              component="a"
              href="https://www.linkedin.com/in/kelvink96/"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconBrandLinkedin size={ICON_SIZE} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              component="a"
              href="https://www.facebook.com/kelvinkk96"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconBrandFacebook size={ICON_SIZE} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              component="a"
              href="https://www.instagram.com/kelvink_96/"
              target="_blank"
              {...ACTION_ICON_PROPS}
            >
              <IconBrandInstagram size={ICON_SIZE} />
            </ActionIcon>
          </Group>
        </Flex>
      </Container>
    </footer>
  );
};

export default FooterNav;

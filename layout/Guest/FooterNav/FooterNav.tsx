import {
  ActionIcon,
  ActionIconProps,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Logo } from '@/components';
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconWorld,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { PATH_DOCS } from '@/routes';
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
      <Container mb="xl">
        <Stack gap="lg">
          <Title ta="center" order={2}>
            Start building with Design Sparx today
          </Title>
          <Text ta="center">
            Stop wasting time building your application from scratch. Design
            Sparx is fast, extendable and fully customizable.
          </Text>
          <Group justify="center">
            <Button
              size="md"
              component="a"
              target="_blank"
              href={PATH_DOCS.root}
            >
              Read Documentation
            </Button>
            <Button size="md">Purchase Now</Button>
          </Group>
        </Stack>
      </Container>
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
    </footer>
  );
};

export default FooterNav;

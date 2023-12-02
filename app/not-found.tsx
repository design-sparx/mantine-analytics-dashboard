'use client';

import {
  Button,
  Center,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import { PATH_DASHBOARD } from '@/routes';
import { IconChevronLeft, IconHome2 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import classes from './error.module.css';

function Error404() {
  const router = useRouter();
  const theme = useMantineTheme();

  return (
    <>
      <>
        <title>Page Not Found | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Center
        style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: theme.colors.gray[0],
          color: theme.colors.dark[8],
        }}
      >
        <Stack>
          <div className={classes.label}>404</div>
          <Title className={classes.title}>
            You have found a secret place.
          </Title>
          <Text fz="md" ta="center" className={classes.description}>
            Unfortunately, this is only a 404 page. You may have mistyped the
            address, or the page has been moved to another URL.
          </Text>
          <Group justify="center" mt="md">
            <Button
              size="md"
              variant="subtle"
              leftSection={<IconChevronLeft size={18} />}
              onClick={() => {
                router.back();
              }}
            >
              Go back
            </Button>
            <Button
              size="md"
              variant="subtle"
              component={Link}
              leftSection={<IconHome2 size={18} />}
              href={PATH_DASHBOARD.default}
            >
              Take me to home page
            </Button>
          </Group>
        </Stack>
      </Center>
    </>
  );
}

export default Error404;

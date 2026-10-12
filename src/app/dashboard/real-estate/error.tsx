'use client';

import { useEffect } from 'react';

import {
  Button,
  Center,
  Code,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Center pt={80}>
      <Stack align="center" gap="md" maw={500} ta="center">
        <Title order={3}>Something went wrong</Title>
        <Text size="sm" c="dimmed">
          The real estate dashboard could not be loaded. Review the error
          below for more detail.
        </Text>
        <Code block color="red.1" c="red.7" fz="sm">
          {error.toString()}
        </Code>
        <Group>
          <Button
            size="sm"
            leftSection={<IconRefresh size={16} />}
            variant="default"
            onClick={() => reset()}
          >
            Try again
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}

export default Error;

import { Center, Loader, Stack, Text } from '@mantine/core';

export default function Loading() {
  return (
    <Center pt={80}>
      <Stack align="center" gap="sm">
        <Loader />
        <Text size="sm" c="dimmed">
          Loading real estate dashboard...
        </Text>
      </Stack>
    </Center>
  );
}

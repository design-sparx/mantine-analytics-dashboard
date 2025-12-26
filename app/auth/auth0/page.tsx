'use client';

import {
  Alert,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconBrandAuth0, IconInfoCircle } from '@tabler/icons-react';

export default function Page() {
  return (
    <>
      <title>Auth0 | DesignSparx</title>
      <meta
        name="description"
        content="Auth0 authentication integration page"
      />
      <Container fluid>
        <Stack gap="lg">
          <Group>
            <IconBrandAuth0 size={32} />
            <Title order={3}>Auth0 Authentication</Title>
          </Group>
          <Divider />
          <Paper p="md" shadow="sm">
            <Alert
              icon={<IconInfoCircle size={16} />}
              title="Auth0 Integration"
              color="blue"
            >
              <Stack gap="sm">
                <Text size="sm">
                  This page is a placeholder for Auth0 authentication integration.
                  NextAuth has been removed from this template.
                </Text>
                <Text size="sm" fw={500}>
                  To implement Auth0:
                </Text>
                <Text size="sm">
                  1. Install the Auth0 SDK: <code>npm install @auth0/nextjs-auth0</code>
                </Text>
                <Text size="sm">
                  2. Configure your Auth0 application credentials in <code>.env.local</code>
                </Text>
                <Text size="sm">
                  3. Follow the{' '}
                  <a
                    href="https://auth0.com/docs/quickstart/webapp/nextjs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Auth0 Next.js Quickstart guide
                  </a>
                </Text>
              </Stack>
            </Alert>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

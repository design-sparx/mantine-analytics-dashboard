'use client';

import { PropsWithChildren } from 'react';

import { Container, Stack } from '@mantine/core';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Container fluid>
      <Stack gap="lg">
        {children}
      </Stack>
    </Container>
  );
}

import { Anchor, Container, Stack } from '@mantine/core';

import { PageHeader } from '@/components';
import KanbanBoard from '@/components/kanban-board/KanbanBoardClient';
import { PATH_DASHBOARD } from '@/routes';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tasks',
};

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Tasks', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

export default function Tasks() {
  return (
    <Container fluid>
      <Stack gap="lg">
        <PageHeader title="Tasks" breadcrumbItems={items} />
        <KanbanBoard />
      </Stack>
    </Container>
  );
}

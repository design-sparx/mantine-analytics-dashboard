'use client';

import dynamic from 'next/dynamic';

const KanbanBoard = dynamic(
  () =>
    import('@/components/kanban-board/KanbanBoard').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div style={{ height: '70vh', minHeight: '400px' }} />,
  },
);

export default KanbanBoard;

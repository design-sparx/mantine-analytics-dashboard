'use client';

import { Button } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

import { PATH_TASKS } from '@/routes';

/**
 * Client component because `component={Link}` passes a function, which a
 * server component cannot hand to Mantine's `Button` across the RSC boundary.
 */
export function ViewAllTasksButton() {
  return (
    <Button
      variant="subtle"
      component={Link}
      href={PATH_TASKS.root}
      rightSection={<IconChevronRight size={18} />}
    >
      View all
    </Button>
  );
}

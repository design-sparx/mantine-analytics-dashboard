import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BaseCard } from '@/components/shared';

describe('test harness', () => {
  it('resolves the @/ alias and renders a Mantine component in jsdom', () => {
    render(
      <MantineProvider>
        <BaseCard title="Alias works">content</BaseCard>
      </MantineProvider>,
    );

    expect(screen.getByText('Alias works')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});

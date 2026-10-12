import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardSection } from '@/components/dashboard-section';

let boom: boolean;

const Boom = () => {
  if (boom) {
    throw new Error('kaboom');
  }
  return <p>ok</p>;
};

describe('DashboardSection', () => {
  beforeEach(() => {
    boom = true;
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the other sections when one section throws', () => {
    render(
      <MantineProvider>
        <DashboardSection title="Broken">
          <Boom />
        </DashboardSection>
        <DashboardSection title="Fine">
          <p>ok</p>
        </DashboardSection>
      </MantineProvider>,
    );

    expect(screen.getByText('ok')).toBeInTheDocument();
    expect(
      screen.getByRole('alert', { name: /could not render/i }),
    ).toBeInTheDocument();
  });

  it('offers a retry that re-renders the section', async () => {
    boom = true;

    render(
      <MantineProvider>
        <DashboardSection title="Broken">
          <Boom />
        </DashboardSection>
      </MantineProvider>,
    );

    expect(
      screen.getByRole('alert', { name: /could not render/i }),
    ).toBeInTheDocument();

    boom = false;
    await userEvent.click(screen.getByText('Try again'));

    expect(screen.getByText('ok')).toBeInTheDocument();
  });
});

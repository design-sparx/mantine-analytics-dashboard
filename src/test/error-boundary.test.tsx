import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorPage from '@/app/error';
import GlobalError from '@/app/global-error';

/**
 * Regression for https://github.com/design-sparx/mantine-analytics-dashboard/issues/174
 *
 * The route error screen's refresh button referenced `window.location.reload`
 * without calling it, and a crash in the root layout had no branded fallback.
 */
const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const originalLocation = window.location;
let reload: ReturnType<typeof vi.fn>;

beforeEach(() => {
  reload = vi.fn();
  push.mockClear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, reload },
  });
});

afterEach(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: originalLocation,
  });
});

describe('route error boundary (app/error.tsx)', () => {
  const thrown = new Error('route exploded');

  const renderPage = () =>
    render(
      <MantineProvider>
        <ErrorPage error={thrown} reset={vi.fn()} />
      </MantineProvider>,
    );

  it('renders the recovery UI with the thrown error', () => {
    renderPage();

    expect(screen.getByText('Sorry, unexpected error..')).toBeInTheDocument();
    expect(screen.getByText('Error: route exploded')).toBeInTheDocument();
  });

  it('reloads the page when Refresh Page is clicked', async () => {
    renderPage();

    await userEvent.click(
      screen.getByRole('button', { name: /refresh page/i }),
    );

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('navigates home when Take me to home page is clicked', async () => {
    renderPage();

    await userEvent.click(
      screen.getByRole('button', { name: /take me to home page/i }),
    );

    expect(push).toHaveBeenCalledWith('/');
  });
});

describe('global error boundary (app/global-error.tsx)', () => {
  const thrown = new Error('layout exploded');

  it('renders its own document with the custom recovery UI', () => {
    const html = renderToStaticMarkup(
      <GlobalError error={thrown} reset={vi.fn()} />,
    );

    expect(html.startsWith('<html')).toBe(true);
    expect(html).toContain('<body>');
    expect(html).toContain('Sorry, unexpected error..');
    expect(html).toContain('Error: layout exploded');
  });

  it('reloads the page from the root-layout fallback', async () => {
    render(<GlobalError error={thrown} reset={vi.fn()} />);

    await userEvent.click(
      screen.getByRole('button', { name: /refresh page/i }),
    );

    expect(reload).toHaveBeenCalledTimes(1);
  });
});

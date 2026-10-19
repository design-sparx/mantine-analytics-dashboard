import { MantineProvider } from '@mantine/core';
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import TextEditor from '@/components/text-editor/TextEditor';

describe('TextEditor', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers each tiptap extension once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <MantineProvider>
        <TextEditor label="Notes" content="<p>Hello</p>" />
      </MantineProvider>,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    const duplicateWarnings = warn.mock.calls.filter((args) =>
      String(args[0]).includes('Duplicate extension names'),
    );
    expect(duplicateWarnings).toEqual([]);
  });
});

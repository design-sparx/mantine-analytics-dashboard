'use client';

import { Component, type ReactNode, useState } from 'react';

import { Button, PaperProps, Text } from '@mantine/core';

import { ErrorAlert, Surface } from '@/components';

type DashboardSectionProps = {
  title: string;
  children: ReactNode;
} & PaperProps;

type DashboardSectionState = {
  hasError: boolean;
  error: Error | null;
};

class SectionErrorBoundary extends Component<
  { children: ReactNode; title: string; onReset: () => void },
  DashboardSectionState
> {
  constructor(props: { children: ReactNode; title: string; onReset: () => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): DashboardSectionState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <ErrorAlert
            title={`Could not render ${this.props.title}`}
            message={this.state.error?.message ?? 'Something went wrong.'}
          />
          <Button
            variant="light"
            color="red"
            size="sm"
            onClick={this.props.onReset}
            mt="sm"
          >
            Try again
          </Button>
        </>
      );
    }

    return this.props.children;
  }
}

export function DashboardSection({
  title,
  children,
  ...paperProps
}: DashboardSectionProps) {
  const reset = () => {
    setKey((k) => k + 1);
  };

  const [key, setKey] = useState(0);

  return (
    <Surface {...paperProps}>
      <Text size="lg" fw={600} mb="md">
        {title}
      </Text>

      <SectionErrorBoundary
        key={`${title}-${key}`}
        title={title}
        onReset={reset}
      >
        {children}
      </SectionErrorBoundary>
    </Surface>
  );
}

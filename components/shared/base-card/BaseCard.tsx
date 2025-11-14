import { ReactNode } from 'react';

import { Divider, Group, Paper, PaperProps, Stack, Text, Title } from '@mantine/core';

import { CardBaseProps } from '@/types/components';

/**
 * BaseCard - A reusable card component with consistent styling and structure
 *
 * @component
 * @example
 * ```tsx
 * <BaseCard
 *   title="Statistics"
 *   description="Monthly overview"
 *   icon={<IconChart />}
 *   footer={<Button>View Details</Button>}
 * >
 *   <Text>Card content goes here</Text>
 * </BaseCard>
 * ```
 */
type BaseCardProps = {
  /** Main content of the card */
  children: ReactNode;
} & CardBaseProps &
  PaperProps;

const BaseCard = ({
  title,
  description,
  icon,
  footer,
  withBorder = true,
  children,
  ...others
}: BaseCardProps) => {
  const hasHeader = title || description || icon;
  const hasFooter = !!footer;

  return (
    <Paper withBorder={withBorder} radius="md" p="md" {...others}>
      <Stack gap="md">
        {/* Header */}
        {hasHeader && (
          <Stack gap="xs">
            <Group justify="space-between" align="start">
              {(title || description) && (
                <Stack gap={4}>
                  {title && (
                    <Title order={4} size="h5">
                      {title}
                    </Title>
                  )}
                  {description && (
                    <Text size="sm" c="dimmed">
                      {description}
                    </Text>
                  )}
                </Stack>
              )}
              {icon}
            </Group>
            <Divider />
          </Stack>
        )}

        {/* Content */}
        {children}

        {/* Footer */}
        {hasFooter && (
          <>
            <Divider />
            {footer}
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default BaseCard;
export type { BaseCardProps };

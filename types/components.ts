import { ReactNode } from 'react';

/**
 * Common component sizes
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Common component variants
 */
export type ComponentVariant = 'default' | 'filled' | 'outlined' | 'light' | 'subtle';

/**
 * Loading state for components
 */
export type LoadingState = {
  loading: boolean;
  loadingText?: string;
};

/**
 * Error state for components
 */
export type ErrorState = {
  error?: Error | string | null;
  onRetry?: () => void;
};

/**
 * Common props for components with loading and error states
 */
export type AsyncComponentProps = LoadingState & ErrorState;

/**
 * Common props for card components
 */
export type CardBaseProps = {
  /** Card title */
  title?: ReactNode;
  /** Card subtitle or description */
  description?: ReactNode;
  /** Icon to display in the card */
  icon?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Whether the card has a border */
  withBorder?: boolean;
};

/**
 * Common props for stats display
 */
export type StatsData = {
  /** Label/title of the statistic */
  title: string;
  /** The value to display */
  value: string | number;
  /** Percentage or numeric change from previous period */
  diff?: number;
  /** Period description (e.g., "vs last month") */
  period?: string;
  /** Icon for the stat */
  icon?: ReactNode;
};

/**
 * Pagination props
 */
export type PaginationProps = {
  /** Current page number (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of items per page */
  pageSize?: number;
};

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort state
 */
export type SortState<T = string> = {
  /** Field to sort by */
  field: T;
  /** Sort direction */
  direction: SortDirection;
};

/**
 * Filter state for lists/tables
 */
export type FilterState = Record<string, unknown>;

/**
 * Search props
 */
export type SearchProps = {
  /** Search query string */
  query: string;
  /** Callback when search query changes */
  onQueryChange: (query: string) => void;
  /** Placeholder text for search input */
  placeholder?: string;
};

/**
 * Action callback with optional loading state
 */
export type ActionCallback<T = void> = {
  /** The action function */
  action: (data?: T) => void | Promise<void>;
  /** Whether the action is currently loading */
  loading?: boolean;
};

/**
 * Common confirmation dialog props
 */
export type ConfirmationProps = {
  /** Whether the confirmation dialog is open */
  opened: boolean;
  /** Dialog title */
  title: string;
  /** Dialog message/content */
  message: ReactNode;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when cancelled */
  onCancel: () => void;
  /** Whether the action is dangerous/destructive */
  destructive?: boolean;
};

/**
 * Empty state props
 */
export type EmptyStateProps = {
  /** Title for empty state */
  title?: string;
  /** Description text */
  description?: string;
  /** Icon to display */
  icon?: ReactNode;
  /** Action button for empty state */
  action?: {
    label: string;
    onClick: () => void;
  };
};

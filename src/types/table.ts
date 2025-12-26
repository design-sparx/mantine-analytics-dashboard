import { ReactNode } from 'react';

import { DataTableColumn } from 'mantine-datatable';

import { FilterState, PaginationProps, EmptyStateProps, SortDirection, SortState } from './components';

/**
 * Column definition for data tables
 */
export type TableColumn<T> = {
  /** Unique key for the column */
  key: string;
  /** Column header label */
  label: string;
  /** Accessor function or property key */
  accessor?: keyof T | ((row: T) => unknown);
  /** Custom render function for cell content */
  render?: (value: unknown, row: T, index: number) => ReactNode;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Whether the column is hidden by default */
  hidden?: boolean;
  /** Column width (CSS value) */
  width?: string | number;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether to wrap text */
  noWrap?: boolean;
};

/**
 * Table row selection props
 */
export type TableSelection<T> = {
  /** Currently selected rows */
  selectedRows: T[];
  /** Callback when selection changes */
  onSelectionChange: (rows: T[]) => void;
  /** Row key accessor */
  getRowId: (row: T) => string | number;
};

/**
 * Table error props
 */
export type TableError = {
  /** Error object, string, or ReactNode */
  error?: Error | string | ReactNode | null;
  /** Callback to retry loading */
  onRetry?: () => void;
};

/**
 * Base table props for all table components
 */
export type BaseTableProps<T> = {
  /** Array of data to display in the table */
  data: T[];
  /** Column definitions using mantine-datatable's DataTableColumn type */
  columns: DataTableColumn<T>[];
  /** Whether data is loading */
  loading?: boolean;
  /** Error state */
  error?: TableError['error'];
  /** Retry callback for errors */
  onRetry?: () => void;
  /** Empty state configuration */
  emptyState?: EmptyStateProps;
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Row key accessor for React keys */
  getRowId?: (row: T, index: number) => string | number;
  /** Whether rows are striped */
  striped?: boolean;
  /** Whether rows are highlighted on hover */
  highlightOnHover?: boolean;
  /** Whether table has a border */
  withBorder?: boolean;
  /** Whether column headers are sticky */
  stickyHeader?: boolean;
  /** Maximum height for scrollable table */
  maxHeight?: number;
};

/**
 * Sortable table props
 */
export type SortableTableProps<T> = BaseTableProps<T> & {
  /** Current sort state */
  sortState?: SortState<keyof T>;
  /** Callback when sort changes */
  onSortChange?: (sortState: SortState<keyof T>) => void;
};

/**
 * Filterable table props
 */
export type FilterableTableProps<T> = BaseTableProps<T> & {
  /** Current filter state */
  filters?: FilterState;
  /** Callback when filters change */
  onFiltersChange?: (filters: FilterState) => void;
  /** Whether to show filter controls */
  showFilters?: boolean;
};

/**
 * Paginated table props
 */
export type PaginatedTableProps<T> = BaseTableProps<T> & PaginationProps;

/**
 * Full-featured table with sorting, filtering, pagination, and selection
 */
export type AdvancedTableProps<T> = BaseTableProps<T> & {
  /** Sort configuration */
  sort?: {
    sortState: SortState<keyof T>;
    onSortChange: (sortState: SortState<keyof T>) => void;
  };
  /** Filter configuration */
  filter?: {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    showFilters?: boolean;
  };
  /** Pagination configuration */
  pagination?: PaginationProps;
  /** Selection configuration */
  selection?: TableSelection<T>;
  /** Search configuration */
  search?: {
    query: string;
    onQueryChange: (query: string) => void;
    placeholder?: string;
  };
  /** Actions for selected rows */
  bulkActions?: Array<{
    label: string;
    onClick: (selectedRows: T[]) => void;
    icon?: ReactNode;
    destructive?: boolean;
  }>;
};

/**
 * Table state management helper types
 */
export type TableState<T> = {
  data: T[];
  loading: boolean;
  error: Error | null;
  sortState?: SortState<keyof T>;
  filters?: FilterState;
  page: number;
  pageSize: number;
  totalPages: number;
  selectedRows: T[];
};

/**
 * Table actions for state management
 */
export type TableActions<T> = {
  setData: (data: T[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setSortState: (sortState: SortState<keyof T>) => void;
  setFilters: (filters: FilterState) => void;
  setPage: (page: number) => void;
  setSelectedRows: (rows: T[]) => void;
  refresh: () => void;
};

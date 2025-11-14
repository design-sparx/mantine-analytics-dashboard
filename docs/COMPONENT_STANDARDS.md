# Component Standards

This document defines the standards and best practices for creating and maintaining components in the Mantine Analytics Dashboard project.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Naming Conventions](#naming-conventions)
- [TypeScript Standards](#typescript-standards)
- [Export Patterns](#export-patterns)
- [Component Structure](#component-structure)
- [Styling Guidelines](#styling-guidelines)
- [Documentation Requirements](#documentation-requirements)
- [Storybook Integration](#storybook-integration)
- [Examples](#examples)

---

## Directory Structure

### Single Component Directory

Use this structure for standalone components:

```
component-name/
├── ComponentName.tsx           # Main component file
├── ComponentName.module.css    # Styles (if needed)
├── ComponentName.stories.tsx   # Storybook stories (if applicable)
├── types.ts                    # TypeScript type definitions
├── index.ts                    # Barrel export
└── README.md                   # Usage documentation (optional)
```

**Example:** `stats-card/StatsCard.tsx`

### Multi-Component Directory

Use this structure for feature modules with multiple related components:

```
feature-name/
├── FeatureName.tsx             # Main/parent component
├── SubComponentA.tsx           # Child component
├── SubComponentB.tsx           # Child component
├── types.ts                    # All type definitions
├── utils.ts                    # Helper functions (if needed)
├── index.ts                    # Barrel exports
├── FeatureName.module.css      # Shared styles
├── FeatureName.stories.tsx     # All component stories
└── README.md                   # Usage documentation
```

**Example:** `invoices-table/InvoicesTable.tsx`

### Shared/Base Components

Place reusable base components in `components/shared/`:

```
components/
├── shared/                     # Reusable across features
│   ├── base-table/
│   ├── base-card/
│   └── base-button/
├── dashboard/                  # Dashboard-specific
├── forms/                      # Form components
└── layout/                     # Layout components
```

---

## Naming Conventions

### File Naming

- **Component files**: Use PascalCase matching the component name
  - ✅ `StatsCard.tsx`
  - ❌ `stats-card.tsx`, `StatsCard.component.tsx`

- **CSS Modules**: Match the component name exactly
  - ✅ `StatsCard.module.css`
  - ❌ `Stats.module.css`, `stats-card.module.css`

- **Stories**: Match the component name with `.stories.tsx` suffix
  - ✅ `StatsCard.stories.tsx`
  - ❌ `StatsCard.story.tsx`, `stats-card.stories.tsx`

- **Type files**: Use lowercase with hyphens
  - ✅ `types.ts`, `table-types.ts`
  - ❌ `Types.ts`, `tableTypes.ts`

### Component Naming

- Use PascalCase for all component names
- Be descriptive and specific
- Avoid abbreviations unless commonly understood
  - ✅ `UserProfileCard`, `NavigationBar`
  - ❌ `UsrProfCard`, `NavBar`

### Directory Naming

- Use kebab-case (lowercase with hyphens)
- Should reflect the component name but in kebab-case format
  - ✅ `stats-card/`, `user-button/`, `invoices-table/`
  - ❌ `StatsCard/`, `userButton/`, `stats_card/`

**Examples:**
- Component: `StatsCard` → Directory: `stats-card/`
- Component: `UserProfileCard` → Directory: `user-profile-card/`
- Component: `InvoicesTable` → Directory: `invoices-table/`

---

## TypeScript Standards

### No `any` Types

**Rule**: Never use `any` types without explicit justification and TSLint disable comment.

❌ **Bad**:
```typescript
type TableProps = {
  data: any[];
  onSelect: (item: any) => void;
};
```

✅ **Good**:
```typescript
type TableProps<T> = {
  data: T[];
  onSelect: (item: T) => void;
};
```

### No `@ts-ignore`

**Rule**: Avoid `@ts-ignore`. Use proper types or `@ts-expect-error` with explanation.

❌ **Bad**:
```typescript
// @ts-ignore
const result = someFunction();
```

✅ **Good**:
```typescript
// @ts-expect-error - Legacy API returns unknown type, tracked in JIRA-123
const result = someFunction() as ExpectedType;
```

### Use Strict Types

- Import types from `@/lib/api.d.ts` for API data
- Define clear prop types with TypeScript interfaces
- Use generics for reusable components
- Extend Mantine types properly

✅ **Example**:
```typescript
import { PaperProps } from '@mantine/core';
import { components } from '@/lib/api';

type Invoice = components['schemas']['Invoice'];

type InvoiceCardProps = {
  invoice: Invoice;
  onEdit?: (id: string) => void;
  loading?: boolean;
} & PaperProps;
```

### Type Definitions

- Place types in `types.ts` for complex components
- Export all types for external use
- Use discriminated unions for variant props
- Document complex types with JSDoc

✅ **Example**:
```typescript
// types.ts
export type Variant = 'default' | 'outlined' | 'filled';

export type Size = 'sm' | 'md' | 'lg';

/**
 * Props for the StatsCard component
 */
export type StatsCardProps = {
  /** The title of the stat */
  title: string;
  /** The value to display */
  value: string | number;
  /** Percentage change from previous period */
  diff?: number;
  /** Visual variant */
  variant?: Variant;
} & PaperProps;
```

---

## Export Patterns

### Index Files (Required)

**Rule**: Every component directory MUST have an `index.ts` file.

✅ **Single Export**:
```typescript
// components/StatsCard/index.ts
export { default } from './StatsCard';
export * from './types';
```

✅ **Multiple Exports**:
```typescript
// components/Buttons/index.ts
export { default as ActionButton } from './ActionButton';
export { default as ButtonGroup } from './ButtonGroup';
export * from './types';
```

### Main Components Index

**Rule**: Use consistent barrel exports in `components/index.ts`.

✅ **Good**:
```typescript
// components/index.ts
export { default as Logo } from './Logo';
export { default as StatsCard } from './StatsCard';
export { default as Surface } from './Surface';
export { default as UserButton } from './UserButton';

// Export types
export * from './StatsCard/types';
export * from './UserButton/types';
```

### Default vs Named Exports

**Guideline**:
- Use **default export** for primary component
- Use **named exports** for:
  - Types
  - Helper components
  - Utilities
  - Constants

```typescript
// Component file
const StatsCard = ({ data }: StatsCardProps) => {
  // ...
};

export default StatsCard;
export type { StatsCardProps };
export { STATS_CARD_VARIANTS };
```

---

## Component Structure

### Basic Component Template

```typescript
'use client'; // Only if component has interactivity

import { ComponentProps } from '@mantine/core';
import classes from './ComponentName.module.css';

/**
 * ComponentName - Brief description
 *
 * @component
 * @example
 * <ComponentName prop1="value" prop2={123} />
 */

type ComponentNameProps = {
  /** Description of prop1 */
  prop1: string;
  /** Description of prop2 */
  prop2?: number;
} & ComponentProps;

const ComponentName = ({ prop1, prop2, ...others }: ComponentNameProps) => {
  // Component logic here

  return (
    <div {...others}>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
export type { ComponentNameProps };
```

### Client Component Directive

**Rule**: Use `'use client'` only when necessary.

**Required for**:
- Interactive components (onClick, onChange, etc.)
- Components using React hooks (useState, useEffect, etc.)
- Components using browser APIs
- Components using Mantine interactive components (Modal, Menu, etc.)

**Not required for**:
- Purely presentational components
- Server components
- Static content

```typescript
// ✅ Needs 'use client'
'use client';

import { useState } from 'react';

const InteractiveCard = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
};

// ✅ No 'use client' needed
const StaticCard = ({ title }: { title: string }) => {
  return <div>{title}</div>;
};
```

### Extending Mantine Components

Always extend Mantine component props properly:

```typescript
import { ButtonProps, PaperProps, TextProps } from '@mantine/core';

// Extend base Mantine props
type CustomButtonProps = {
  loading?: boolean;
  icon?: React.ReactNode;
} & ButtonProps;

type CardProps = {
  title: string;
  children: React.ReactNode;
} & PaperProps;
```

---

## Styling Guidelines

### CSS Modules (Recommended)

Use CSS Modules for component-specific styles:

1. **Create module file**: `ComponentName.module.css`
2. **Import in component**: `import classes from './ComponentName.module.css'`
3. **Use className**: `<div className={classes.container}>`

```css
/* StatsCard.module.css */
.title {
  font-weight: 700;
  text-transform: uppercase;
  color: var(--mantine-color-dimmed);
}

.value {
  font-size: 2rem;
  line-height: 1;
}

.diff {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
```

```typescript
// StatsCard.tsx
import classes from './StatsCard.module.css';

const StatsCard = ({ data }: Props) => (
  <div>
    <Text className={classes.title}>{data.title}</Text>
    <Text className={classes.value}>{data.value}</Text>
  </div>
);
```

### Mantine Props (Alternative)

For simple styling, use Mantine props:

```typescript
<Text size="sm" fw={700} c="dimmed" tt="uppercase">
  {title}
</Text>
```

### CSS Custom Properties

Use CSS custom properties for themeable values:

```css
.container {
  background: var(--mantine-color-body);
  border-color: var(--mantine-color-default-border);
  border-radius: var(--mantine-radius-default);
}
```

### Styling Strategy

- **CSS Modules**: Complex components with many styles
- **Mantine Props**: Simple components, quick styling
- **Inline Styles**: Avoid unless absolutely necessary
- **Global Styles**: Only in `theme/` directory

---

## Documentation Requirements

### JSDoc Comments

**Required for**:
- All exported components
- All exported types
- Complex functions
- Props with non-obvious purpose

```typescript
/**
 * StatsCard - Displays a statistic with title, value, and trend indicator
 *
 * @component
 * @example
 * ```tsx
 * <StatsCard
 *   data={{
 *     title: 'Revenue',
 *     value: '$45,231',
 *     diff: 12.5
 *   }}
 * />
 * ```
 *
 * @param props - Component props
 * @returns The rendered StatsCard component
 */
type StatsCardProps = {
  /** Data object containing the statistic information */
  data: {
    /** The title/label of the statistic */
    title: string;
    /** The main value to display */
    value: string;
    /** Percentage difference from previous period (positive or negative) */
    diff?: number;
    /** The time period for comparison (e.g., "vs last month") */
    period?: string;
  };
} & PaperProps;
```

### README Files (Optional but Recommended)

For complex components, add a README.md:

```markdown
# ComponentName

Brief description of the component and its purpose.

## Usage

\`\`\`tsx
import { ComponentName } from '@/components';

<ComponentName prop1="value" prop2={123} />
\`\`\`

## Props

- `prop1` (string, required): Description
- `prop2` (number, optional): Description

## Examples

### Basic Example
\`\`\`tsx
<ComponentName prop1="simple" />
\`\`\`

### Advanced Example
\`\`\`tsx
<ComponentName
  prop1="advanced"
  prop2={456}
  onAction={handleAction}
/>
\`\`\`

## Notes

- Important implementation details
- Known limitations
- Performance considerations
```

---

## Storybook Integration

### Creating Stories

**Required for**: All reusable components.

**File**: `ComponentName.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prop1: 'Default value',
    prop2: 123,
  },
};

export const WithCustomProps: Story = {
  args: {
    prop1: 'Custom value',
    prop2: 456,
    variant: 'outlined',
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};
```

### Story Best Practices

- Create stories for all visual states
- Include interactive controls with `argTypes`
- Add documentation with `parameters.docs`
- Group related components under same category
- Show examples of common use cases

---

## Examples

### Simple Presentational Component

```typescript
// components/Badge/Badge.tsx
import { Badge as MantineBadge, BadgeProps as MantineBadgeProps } from '@mantine/core';

/**
 * Custom Badge component with app-specific defaults
 */
type BadgeProps = {
  /** The label text */
  label: string;
} & MantineBadgeProps;

const Badge = ({ label, variant = 'filled', ...others }: BadgeProps) => {
  return (
    <MantineBadge variant={variant} {...others}>
      {label}
    </MantineBadge>
  );
};

export default Badge;
export type { BadgeProps };
```

```typescript
// components/Badge/index.ts
export { default } from './Badge';
export type { BadgeProps } from './Badge';
```

### Interactive Component with State

```typescript
// components/Counter/Counter.tsx
'use client';

import { useState } from 'react';
import { Button, Group, Text } from '@mantine/core';

/**
 * Counter - A simple counter component with increment/decrement buttons
 *
 * @component
 * @example
 * <Counter initialValue={0} onUpdate={(val) => console.log(val)} />
 */
type CounterProps = {
  /** Initial counter value */
  initialValue?: number;
  /** Callback fired when counter changes */
  onUpdate?: (value: number) => void;
};

const Counter = ({ initialValue = 0, onUpdate }: CounterProps) => {
  const [count, setCount] = useState(initialValue);

  const handleIncrement = () => {
    const newValue = count + 1;
    setCount(newValue);
    onUpdate?.(newValue);
  };

  const handleDecrement = () => {
    const newValue = count - 1;
    setCount(newValue);
    onUpdate?.(newValue);
  };

  return (
    <Group>
      <Button onClick={handleDecrement}>-</Button>
      <Text fw={700}>{count}</Text>
      <Button onClick={handleIncrement}>+</Button>
    </Group>
  );
};

export default Counter;
export type { CounterProps };
```

### Complex Component with Multiple Files

```typescript
// components/DataTable/types.ts
export type SortDirection = 'asc' | 'desc';

export type Column<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: Error | null;
  onRowClick?: (row: T) => void;
};
```

```typescript
// components/DataTable/DataTable.tsx
'use client';

import { Table, Loader, Alert } from '@mantine/core';
import { DataTableProps } from './types';

/**
 * DataTable - A reusable data table component with sorting and error handling
 */
function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading,
  error,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error.message}</Alert>;

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          {columns.map((col) => (
            <Table.Th key={String(col.key)}>{col.label}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((row, idx) => (
          <Table.Tr key={idx} onClick={() => onRowClick?.(row)}>
            {columns.map((col) => (
              <Table.Td key={String(col.key)}>
                {col.render ? col.render(row[col.key], row) : String(row[col.key])}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export default DataTable;
```

```typescript
// components/DataTable/index.ts
export { default } from './DataTable';
export * from './types';
```

---

## Quick Reference Checklist

When creating a new component, ensure:

- [ ] Component file uses PascalCase and matches directory name
- [ ] CSS Module (if used) matches component name exactly
- [ ] `index.ts` file exists with proper exports
- [ ] TypeScript types are strict (no `any`, no `@ts-ignore`)
- [ ] Props extend Mantine types where applicable
- [ ] JSDoc comments for component and complex props
- [ ] `'use client'` directive if component is interactive
- [ ] Storybook story created with key variants
- [ ] Component exported from main `components/index.ts`
- [ ] README added for complex components (optional)

---

## Migration Guide

### Updating Existing Components

When refactoring existing components to match these standards:

1. **Add index.ts** if missing
2. **Fix CSS module naming** to match component name
3. **Remove any types** - replace with proper types
4. **Remove @ts-ignore** - fix underlying type issues
5. **Add JSDoc comments** for documentation
6. **Create Storybook story** if missing
7. **Update main index.ts** to use consistent pattern

### Breaking Changes

When making changes that affect component API:

1. Document in component README
2. Add migration guide in PR description
3. Update all usages in codebase
4. Add deprecation warnings if needed
5. Update Storybook stories

---

## Resources

- [Mantine Documentation](https://mantine.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Storybook Documentation](https://storybook.js.org/docs)
- [API Integration Guide](./API_INTEGRATION.md)
- [RBAC System](./RBAC_SYSTEM.md)

---

**Last Updated**: 2025-11-14
**Maintained By**: Development Team

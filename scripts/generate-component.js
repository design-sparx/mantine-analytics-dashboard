#!/usr/bin/env node

/**
 * Component Generator Script
 *
 * Usage: node scripts/generate-component.js <ComponentName> [type]
 *
 * Types:
 * - basic (default): Basic presentational component
 * - interactive: Component with client-side interactivity
 * - table: Table component extending BaseTable
 * - card: Card component extending BaseCard
 *
 * Example: node scripts/generate-component.js MyComponent interactive
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const componentName = args[0];
const componentType = args[1] || 'basic';

if (!componentName) {
  console.error('❌ Error: Component name is required');
  console.log(
    '\nUsage: node scripts/generate-component.js <ComponentName> [type]',
  );
  console.log('\nTypes: basic, interactive, table, card');
  process.exit(1);
}

// Validate component name (PascalCase)
if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
  console.error(
    '❌ Error: Component name must be in PascalCase (e.g., MyComponent)',
  );
  process.exit(1);
}

// Convert PascalCase to kebab-case for directory name
function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])([a-z])/g, '$1-$2$3')
    .toLowerCase();
}

const componentsDir = path.join(process.cwd(), 'src', 'components');
const directoryName = toKebabCase(componentName);
const componentDir = path.join(componentsDir, directoryName);

// Check if component already exists
if (fs.existsSync(componentDir)) {
  console.error(
    `❌ Error: Component "${componentName}" already exists at src/components/${directoryName}/`,
  );
  process.exit(1);
}

// Templates for different component types
const templates = {
  basic: {
    component: `import { ReactNode } from 'react';

/**
 * ${componentName} - [Brief description]
 *
 * @component
 * @example
 * \`\`\`tsx
 * <${componentName} prop1="value" />
 * \`\`\`
 */
type ${componentName}Props = {
  /** Description of prop */
  prop1?: string;
  children?: ReactNode;
};

const ${componentName} = ({ prop1, children }: ${componentName}Props) => {
  return (
    <div>
      {children || \`${componentName} Component\`}
    </div>
  );
};

export default ${componentName};
export type { ${componentName}Props };
`,
  },
  interactive: {
    component: `'use client';

import { useState } from 'react';
import { Button, Stack } from '@mantine/core';

/**
 * ${componentName} - [Brief description]
 *
 * @component
 * @example
 * \`\`\`tsx
 * <${componentName} onAction={(value) => console.log(value)} />
 * \`\`\`
 */
type ${componentName}Props = {
  /** Description of prop */
  initialValue?: string;
  /** Callback when action is triggered */
  onAction?: (value: string) => void;
};

const ${componentName} = ({ initialValue = '', onAction }: ${componentName}Props) => {
  const [value, setValue] = useState(initialValue);

  const handleClick = () => {
    onAction?.(value);
  };

  return (
    <Stack>
      <p>${componentName} Component</p>
      <Button onClick={handleClick}>Click Me</Button>
    </Stack>
  );
};

export default ${componentName};
export type { ${componentName}Props };
`,
  },
  table: {
    component: `'use client';

import type { DataTableColumn } from 'mantine-datatable';

import { BaseTable } from '@/components';
import type { BaseTableProps } from '@/types';

/**
 * ${componentName} - [Brief description of what data this table displays]
 *
 * @component
 * @example
 * \`\`\`tsx
 * <${componentName} data={items} loading={isLoading} />
 * \`\`\`
 */

// Define your data type
type ${componentName}Row = {
  id: string;
  name: string;
  // Add more fields as needed
};

type ${componentName}Props = Omit<BaseTableProps<${componentName}Row>, 'columns'>;

const ${componentName} = ({ data, ...others }: ${componentName}Props) => {
  const columns: DataTableColumn<${componentName}Row>[] = [
    {
      accessor: 'id',
      title: 'ID',
    },
    {
      accessor: 'name',
      title: 'Name',
    },
    // Add more columns as needed
  ];

  return <BaseTable<${componentName}Row> data={data} columns={columns} {...others} />;
};

export default ${componentName};
export type { ${componentName}Props, ${componentName}Row };
`,
  },
  card: {
    component: `import { ReactNode } from 'react';

import { BaseCard } from '@/components';

/**
 * ${componentName} - [Brief description]
 *
 * @component
 * @example
 * \`\`\`tsx
 * <${componentName} title="Title">Card content</${componentName}>
 * \`\`\`
 */
type ${componentName}Props = {
  /** Card title */
  title?: ReactNode;
  /** Optional supporting text under the title */
  description?: ReactNode;
  /** Optional icon shown beside the title */
  icon?: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
  children?: ReactNode;
};

const ${componentName} = ({
  title,
  description,
  icon,
  footer,
  children,
}: ${componentName}Props) => {
  return (
    <BaseCard title={title} description={description} icon={icon} footer={footer}>
      {children}
    </BaseCard>
  );
};

export default ${componentName};
export type { ${componentName}Props };
`,
  },
};

const storybookTemplate = `import type { Meta, StoryObj } from '@storybook/react';
import ${componentName} from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props
  },
};
`;

const indexTemplate = `export { default } from './${componentName}';
export type { ${componentName}Props } from './${componentName}';
`;

// Create component directory
fs.mkdirSync(componentDir, { recursive: true });

// Get the appropriate template
const template = templates[componentType];
if (!template) {
  console.error(`❌ Error: Unknown component type "${componentType}"`);
  console.log('Valid types: basic, interactive, table, card');
  process.exit(1);
}

// Create component file
fs.writeFileSync(
  path.join(componentDir, `${componentName}.tsx`),
  template.component.trim(),
);

// Create index file
fs.writeFileSync(path.join(componentDir, 'index.ts'), indexTemplate.trim());

// Create Storybook story
fs.writeFileSync(
  path.join(componentDir, `${componentName}.stories.tsx`),
  storybookTemplate.trim(),
);

console.log(`✅ Component "${componentName}" created successfully!`);
console.log(`\nFiles created:`);
console.log(`  📁 src/components/${directoryName}/`);
console.log(`  📄 ${componentName}.tsx`);
console.log(`  📄 index.ts`);
console.log(`  📄 ${componentName}.stories.tsx`);
console.log(`\nNext steps:`);
console.log(
  `  1. Edit the component at src/components/${directoryName}/${componentName}.tsx`,
);
console.log(`  2. Add the component to src/components/index.ts:`);
console.log(
  `     export { default as ${componentName} } from './${directoryName}';`,
);
console.log(
  `  3. Use it in your app: import { ${componentName} } from '@/components';`,
);

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
  console.log('\nUsage: node scripts/generate-component.js <ComponentName> [type]');
  console.log('\nTypes: basic, interactive, table, card');
  process.exit(1);
}

// Validate component name (PascalCase)
if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
  console.error('❌ Error: Component name must be in PascalCase (e.g., MyComponent)');
  process.exit(1);
}

// Convert PascalCase to kebab-case for directory name
function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])([a-z])/g, '$1-$2$3')
    .toLowerCase();
}

const componentsDir = path.join(process.cwd(), 'components');
const directoryName = toKebabCase(componentName);
const componentDir = path.join(componentsDir, directoryName);

// Check if component already exists
if (fs.existsSync(componentDir)) {
  console.error(`❌ Error: Component "${componentName}" already exists at ${directoryName}/`);
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

import BaseTable from '@/components/shared/BaseTable';
import { BaseTableProps } from '@/types/table';

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

type ${componentName}Props = Omit<BaseTableProps<${componentName}Row>, 'columns'> & {
  // Add any additional props specific to this table
};

const ${componentName} = ({ data, ...others }: ${componentName}Props) => {
  const columns = [
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
import BaseCard from '@/components/shared/BaseCard';

/**
 * ${componentName} - [Brief description]
 *
 * @component
 * @example
 * \`\`\`tsx
 * <${componentName} title="Title" data={data} />
 * \`\`\`
 */
type ${componentName}Props = {
  /** Card title */
  title?: ReactNode;
  /** Data to display */
  data?: unknown;
  /** Optional icon */
  icon?: ReactNode;
};

const ${componentName} = ({ title, data, icon }: ${componentName}Props) => {
  return (
    <BaseCard title={title} icon={icon}>
      <p>Card content goes here</p>
      {/* Add your card content */}
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
  template.component.trim()
);

// Create index file
fs.writeFileSync(path.join(componentDir, 'index.ts'), indexTemplate.trim());

// Create Storybook story
fs.writeFileSync(
  path.join(componentDir, `${componentName}.stories.tsx`),
  storybookTemplate.trim()
);

console.log(`✅ Component "${componentName}" created successfully!`);
console.log(`\nFiles created:`);
console.log(`  📁 components/${directoryName}/`);
console.log(`  📄 ${componentName}.tsx`);
console.log(`  📄 index.ts`);
console.log(`  📄 ${componentName}.stories.tsx`);
console.log(`\nNext steps:`);
console.log(`  1. Edit the component at components/${directoryName}/${componentName}.tsx`);
console.log(`  2. Add the component to components/index.ts:`);
console.log(`     export { default as ${componentName} } from './${directoryName}';`);
console.log(`  3. Use it in your app: import { ${componentName} } from '@/components';`);

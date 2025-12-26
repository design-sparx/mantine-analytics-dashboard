import {
  Avatar,
  Badge,
  Group,
  Progress,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { IconTrendingDown, IconTrendingUp, IconMinus } from '@tabler/icons-react';
import { ErrorAlert } from '@/components';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  sales: number;
  revenue: number;
  stock: number;
  image: string;
  trend: 'up' | 'down' | 'stable';
}

interface TopProductsTableProps {
  data?: Product[];
  loading?: boolean;
  error?: Error | null;
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <IconTrendingUp size={16} color="var(--mantine-color-teal-6)" />;
    case 'down':
      return <IconTrendingDown size={16} color="var(--mantine-color-red-6)" />;
    default:
      return <IconMinus size={16} color="var(--mantine-color-gray-6)" />;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up':
      return 'teal';
    case 'down':
      return 'red';
    default:
      return 'gray';
  }
};

export const TopProductsTable: React.FC<TopProductsTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading products"
        message={error.message || 'Failed to load top products'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`product-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const maxRevenue = Math.max(...data.map((p) => p.revenue));

  const rows = data.map((product) => (
    <Table.Tr key={product.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar src={product.image} size={40} radius="sm" />
          <div>
            <Text size="sm" fw={500}>
              {product.name}
            </Text>
            <Text size="xs" c="dimmed">
              {product.sku}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue">
          {product.category}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">${product.price.toFixed(2)}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          {getTrendIcon(product.trend)}
          <Text size="sm">{product.sales}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Stack gap={4}>
          <Text size="sm" fw={500}>
            ${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <Progress
            value={(product.revenue / maxRevenue) * 100}
            size="xs"
            color={getTrendColor(product.trend)}
          />
        </Stack>
      </Table.Td>
      <Table.Td>
        <Badge
          variant="light"
          color={product.stock > 100 ? 'teal' : product.stock > 50 ? 'yellow' : 'red'}
        >
          {product.stock} units
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Sales</Table.Th>
            <Table.Th>Revenue</Table.Th>
            <Table.Th>Stock</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

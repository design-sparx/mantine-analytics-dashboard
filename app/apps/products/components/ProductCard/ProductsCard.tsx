'use client';

import { Badge, Group, Paper, PaperProps, Text, Title } from '@mantine/core';

import { IProduct } from '@/types/products';

interface ProductsCardProps extends Omit<PaperProps, 'children'> {
  data: IProduct;
}

export function ProductsCard({ data, ...props }: ProductsCardProps) {
  return (
    <Paper {...props}>
      <Group justify="space-between" mb="xs">
        <Title order={4}>{data.title}</Title>
        <Badge color={data.isActive ? 'green' : 'red'}>
          {data.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </Group>

      <Text lineClamp={2} mb="md" size="sm" c="dimmed">
        {data.description}
      </Text>

      <Group>
        <Text fw={500}>Price: ${data.price.toFixed(2)}</Text>
        <Text>Stock: {data.quantityInStock}</Text>
      </Group>

      <Text size="sm" mt="md">
        Category:{' '}
        {data.categoryName ||
          (data.category && data.category.title) ||
          'Uncategorized'}
      </Text>

      <Text size="xs" c="dimmed" mt="sm">
        SKU: {data.sku || 'N/A'}
      </Text>
    </Paper>
  );
}

export default ProductsCard;

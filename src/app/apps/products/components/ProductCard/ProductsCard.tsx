'use client';

import { Badge, Button, Group, PaperProps, Text, Title } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';

import { Surface } from '@/components';
import { IProduct } from '@/types/products';

interface ProductsCardProps extends Omit<PaperProps, 'children'> {
  data: IProduct;
  onEdit?: (product: IProduct) => void;
}

export function ProductsCard({ data, onEdit, ...props }: ProductsCardProps) {
  // Auth removed - all users can edit for demo purposes
  const isCreator = true;

  return (
    <Surface {...props}>
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

      <Text size="xs" c="dimmed" mt="sm" mb="md">
        SKU: {data.sku || 'N/A'}
      </Text>

      <Group justify="flex-end">
        <Button
          variant="subtle"
          leftSection={<IconEdit size={16} />}
          onClick={() => onEdit && onEdit(data)}
          // Show edit button for all but only enable for creator
          disabled={!isCreator}
          title={
            isCreator
              ? 'Edit product'
              : 'Only the creator can edit this product'
          }
        >
          Edit
        </Button>
      </Group>
    </Surface>
  );
}

export default ProductsCard;

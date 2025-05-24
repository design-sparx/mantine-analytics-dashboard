import { Button, Group, Paper, PaperProps, Text, Title } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';

import { useAuth } from '@/hooks/useAuth';
import { IProductCategory } from '@/types/products';

interface ProductCategoryCardProps extends Omit<PaperProps, 'children'> {
  data: IProductCategory;
  onEdit?: (productCategory: IProductCategory) => void;
}

export const CategoryCard = ({ data, onEdit }: ProductCategoryCardProps) => {
  const { user } = useAuth();
  const isCreator = user?.id === data.createdById;

  return (
    <Paper p="md" shadow="md" radius="md">
      <Title order={4} mb="xs">
        {data.title}
      </Title>
      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
        {data.description || 'No description'}
      </Text>
      <Group>
        <Text size="sm">Products: {data.productCount}</Text>
      </Group>

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
    </Paper>
  );
};

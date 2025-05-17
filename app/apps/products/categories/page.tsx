'use client';

import { useCallback } from 'react';

import {
  Anchor,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useFetch } from '@mantine/hooks';
import { IconMoodEmpty, IconPlus } from '@tabler/icons-react';

import NewCategoryDrawer from '@/app/apps/products/categories/components/NewCategoryDrawerProps';
import { ErrorAlert, PageHeader, Surface } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { PATH_DASHBOARD } from '@/routes';
import { IApiResponse } from '@/types/api-response';
import { IProductCategory } from '@/types/products';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Products', href: '#' },
  { title: 'Categories', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const CategoryCard = ({ data }: { data: IProductCategory }) => (
  <Paper p="md" shadow="md" radius="md">
    <Title order={4} mb="xs">{data.title}</Title>
    <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
      {data.description || 'No description'}
    </Text>
    <Group>
      <Text size="sm">Products: {data.productCount}</Text>
    </Group>
  </Paper>
);

function Categories() {
  const { permissions, accessToken } = useAuth();
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useFetch<IApiResponse<IProductCategory[]>>('/api/product-categories', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
  });

  const canAddCategory = permissions?.includes('Permissions.Products.Create');

  const [newDrawerOpened, { open: newCategoryOpen, close: newCategoryClose }] =
    useDisclosure(false);

  const handleCategoryCreated = useCallback(() => {
    refetchCategories();
  }, [refetchCategories]);

  const categoryItems = categoriesData?.data?.map((category) => (
    <CategoryCard key={category.id} data={category} />
  ));

  const renderContent = () => {
    if (categoriesLoading) {
      return (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={`category-loading-${i}`}
              visible={true}
              height={150}
            />
          ))}
        </SimpleGrid>
      );
    }

    if (categoriesError || !categoriesData?.succeeded) {
      return (
        <ErrorAlert
          title="Error loading categories"
          message={categoriesData?.errors?.join(',')}
        />
      );
    }

    if (!categoriesData?.data?.length) {
      return (
        <Surface component={Paper} p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>No categories found</Title>
            <Text>
              You don&apos;t have any product categories yet. Create one to get started.
            </Text>
            {canAddCategory && (
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={newCategoryOpen}
              >
                New Category
              </Button>
            )}
          </Stack>
        </Surface>
      );
    }

    return (
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        {categoryItems}
      </SimpleGrid>
    );
  };

  return (
    <>
      <>
        <title>Product Categories | DesignSparx</title>
        <meta
          name="description"
          content="Manage product categories in your dashboard"
        />
      </>
      <PageHeader
        title="Product Categories"
        breadcrumbItems={items}
        actionButton={
          canAddCategory &&
          categoriesData?.data?.length && (
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={newCategoryOpen}
            >
              New Category
            </Button>
          )
        }
      />

      {renderContent()}

      <NewCategoryDrawer
        opened={newDrawerOpened}
        onClose={newCategoryClose}
        position="right"
        onCategoryCreated={handleCategoryCreated}
      />
    </>
  );
}

export default Categories;

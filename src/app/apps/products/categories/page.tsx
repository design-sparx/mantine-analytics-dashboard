'use client';

import { useCallback, useState } from 'react';

import {
  Anchor,
  Button,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMoodEmpty, IconPlus } from '@tabler/icons-react';

import NewCategoryDrawer from '@/app/apps/products/categories/components/NewCategoryDrawer';
import { ErrorAlert, PageHeader, Surface } from '@/components';
import { useApiGet } from '@/lib/hooks/useApiGet';
import { API_WRITE } from '@/routes/api';
import { PATH_DASHBOARD } from '@/routes';
import { IProductCategory } from '@/types/products';

import { CategoryCard } from './components/CategoryCard';
import EditCategoryDrawer from './components/EditCategoryDrawer';

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

function Categories() {
  // Note: Mock system doesn't use permissions or access tokens
  const [selectedCategory, setSelectedCategory] =
    useState<IProductCategory | null>(null);

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useApiGet<IProductCategory[]>(API_WRITE.productCategories);

  // In a mock data template, all users can add categories
  const canAddCategory = true;

  const [newDrawerOpened, { open: newCategoryOpen, close: newCategoryClose }] =
    useDisclosure(false);

  const [
    editDrawerOpened,
    { open: editCategoryOpen, close: editCategoryClose },
  ] = useDisclosure(false);

  const handleCategoryCreated = useCallback(() => {
    refetchCategories();
  }, [refetchCategories]);

  const handleEditCategory = (category: IProductCategory) => {
    setSelectedCategory(category);
    editCategoryOpen();
  };

  const handleCategoryUpdated = useCallback(() => {
    refetchCategories();
  }, [refetchCategories]);

  const categoryItems = categoriesData?.map((category) => (
    <CategoryCard
      key={category.id}
      data={category}
      onEdit={handleEditCategory}
    />
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

    if (categoriesError) {
      return (
        <ErrorAlert
          title="Error loading categories"
          message={categoriesError.message}
        />
      );
    }

    if (!categoriesData?.length) {
      return (
        <Surface p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>No categories found</Title>
            <Text>
              You don&apos;t have any product categories yet. Create one to get
              started.
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
          categoriesData?.length && (
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

      <EditCategoryDrawer
        opened={editDrawerOpened}
        onClose={editCategoryClose}
        position="right"
        productCategory={selectedCategory}
        onCategoryUpdated={handleCategoryUpdated}
      />
    </>
  );
}

export default Categories;

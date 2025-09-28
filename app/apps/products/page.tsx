'use client';

import { useCallback, useState } from 'react';

import {
  Anchor,
  Button,
  Paper,
  PaperProps,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useFetch } from '@mantine/hooks';
import { IconMoodEmpty, IconPlus } from '@tabler/icons-react';

import EditProductDrawer from '@/app/apps/products/components/EditProductDrawer';
import NewProductDrawer from '@/app/apps/products/components/NewProductDrawer';
import ProductsCard from '@/app/apps/products/components/ProductCard/ProductsCard';
import { ErrorAlert, PageHeader, Surface } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGate } from '@/lib/api/permissions';
import { PATH_DASHBOARD } from '@/routes';
import { IApiResponse } from '@/types/api-response';
import { IProduct } from '@/types/products';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Products', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const CARD_PROPS: Omit<PaperProps, 'children'> = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function Products() {
  const { hasPermission, accessToken } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useFetch<IApiResponse<IProduct[]>>('/api/products', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
  });

  // Check if the user has permission to add products (now using new RBAC system)
  const canAddProduct = hasPermission('Permissions.Team.Projects'); // Update permission name to match RBAC config

  const [newDrawerOpened, { open: newProductOpen, close: newProductClose }] =
    useDisclosure(false);

  const [editDrawerOpened, { open: editProductOpen, close: editProductClose }] =
    useDisclosure(false);

  const handleProductCreated = useCallback(() => {
    refetchProducts();
  }, [refetchProducts]);

  const handleProductUpdated = useCallback(() => {
    refetchProducts();
  }, [refetchProducts]);

  const handleEditProduct = (product: IProduct) => {
    setSelectedProduct(product);
    editProductOpen();
  };

  const projectItems = productsData?.data?.map((p: IProduct) => (
    <ProductsCard
      key={p.id}
      data={p}
      onEdit={handleEditProduct}
      {...CARD_PROPS}
    />
  ));

  const renderContent = () => {
    if (productsLoading) {
      return (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={`product-loading-${i}`}
              visible={true}
              height={300}
            />
          ))}
        </SimpleGrid>
      );
    }

    if (productsError || !productsData?.succeeded) {
      return (
        <ErrorAlert
          title="Error loading products"
          message={productsData?.errors?.join(',')}
        />
      );
    }

    if (!productsData?.data?.length) {
      return (
        <Surface p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>No products found</Title>
            <Text>
              You don&apos;t have any products yet. Create one to get started.
            </Text>
            <PermissionGate permission="Permissions.Team.Projects">
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={newProductOpen}
              >
                New Product
              </Button>
            </PermissionGate>
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
        {projectItems}
      </SimpleGrid>
    );
  };

  return (
    <>
      <>
        <title>Products | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components."
        />
      </>
      <PageHeader
        title="Products"
        breadcrumbItems={items}
        actionButton={
          productsData?.data?.length && (
            <PermissionGate permission="Permissions.Team.Projects">
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={newProductOpen}
              >
                New Product
              </Button>
            </PermissionGate>
          )
        }
      />

      {renderContent()}

      <NewProductDrawer
        opened={newDrawerOpened}
        onClose={newProductClose}
        position="right"
        onProductCreated={handleProductCreated}
      />

      <EditProductDrawer
        opened={editDrawerOpened}
        onClose={editProductClose}
        position="right"
        product={selectedProduct}
        onProductUpdated={handleProductUpdated}
      />
    </>
  );
}

export default Products;

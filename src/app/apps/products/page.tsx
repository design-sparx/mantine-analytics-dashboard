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
import { useDisclosure } from '@mantine/hooks';
import { IconMoodEmpty, IconPlus } from '@tabler/icons-react';

import EditProductDrawer from '@/app/apps/products/components/EditProductDrawer';
import NewProductDrawer from '@/app/apps/products/components/NewProductDrawer';
import ProductsCard from '@/app/apps/products/components/ProductCard/ProductsCard';
import { ErrorAlert, PageHeader, Surface } from '@/components';
import { useApiGet } from '@/lib/hooks/useApiGet';
import { API_CORE } from '@/routes/api';
import { PATH_DASHBOARD } from '@/routes';
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
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useApiGet<IProduct[]>(API_CORE.products);

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

  const projectItems = productsData?.map((p: IProduct) => (
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

    if (productsError) {
      return (
        <ErrorAlert
          title="Error loading products"
          message={productsError.message}
        />
      );
    }

    if (!productsData?.length) {
      return (
        <Surface p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>No products found</Title>
            <Text>
              You don&apos;t have any products yet. Create one to get started.
            </Text>
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={newProductOpen}
            >
              New Product
            </Button>
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
          productsData?.length && (
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={newProductOpen}
            >
              New Product
            </Button>
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

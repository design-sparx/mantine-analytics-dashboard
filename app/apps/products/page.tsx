'use client';

import { useCallback } from 'react';

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

import NewProductDrawer from '@/app/apps/products/components/NewProductDrawer';
import ProductsCard from '@/app/apps/products/components/ProductCard/ProductsCard';
import { ErrorAlert, PageHeader, Surface } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { PATH_DASHBOARD } from '@/routes';
import { IApiResponse } from '@/types/api-response';
import { IProduct, IProductCategory } from '@/types/products';

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
  const { permissions, accessToken } = useAuth();
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

  // Check if the user has a can add project
  const canAddProject = permissions?.includes('Permissions.Projects.Create');

  const [newDrawerOpened, { open: newProjectOpen, close: newProductClose }] =
    useDisclosure(false);

  const handleProductCreated = useCallback(() => {
    refetchProducts();
  }, [refetchProducts]);

  const projectItems = productsData?.data?.map((p: any) => (
    <ProductsCard key={p.id} data={p} {...CARD_PROPS} />
  ));

  const renderContent = () => {
    if (productsLoading) {
      return (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {Array.from({ length: 8 }).map((o, i) => (
            <Skeleton
              key={`project-loading-${i}`}
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
        <Surface component={Paper} p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>No products found</Title>
            <Text>
              You don&apos;t have any products yet. Create one to get started.
            </Text>
            {canAddProject && (
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={newProjectOpen}
              >
                New Product
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
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <PageHeader
        title="Products"
        breadcrumbItems={items}
        actionButton={
          canAddProject &&
          productsData?.data?.length && (
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={newProjectOpen}
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
    </>
  );
}

export default Products;

'use client';

import {
  Anchor,
  Button,
  CardProps,
  Container,
  SimpleGrid,
  Skeleton,
  Stack,
} from '@mantine/core';
import { useFetch } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';

import { ErrorAlert, PageHeader, ProjectsCard } from '@/components';
import { PROJECTS_API_URL } from '@/constants/api';
import { PATH_DASHBOARD } from '@/routes';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Projects', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 18;

const CARD_PROPS: Omit<CardProps, 'children'> = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function Projects() {
  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useFetch<{
    succeeded: boolean;
    message: string;
    data: [];
    errors: [];
  }>('/api/projects');

  const projectItems = projectsData?.data.map((p: any) => (
    <ProjectsCard key={p.id} {...p} {...CARD_PROPS} />
  ));

  return (
    <>
      <>
        <title>Projects | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Projects"
            breadcrumbItems={items}
            actionButton={
              <Button leftSection={<IconPlus size={18} />}>New Project</Button>
            }
          />
          {projectsError ? (
            <ErrorAlert
              title="Error loading projects"
              message={projectsError.toString()}
            />
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
              {projectsLoading
                ? Array.from({ length: 8 }).map((o, i) => (
                    <Skeleton
                      key={`project-loading-${i}`}
                      visible={true}
                      height={300}
                    />
                  ))
                : projectItems}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default Projects;

'use client';

import { useCallback } from 'react';

import {
  Anchor,
  Button,
  Container,
  PaperProps,
  SimpleGrid,
  Skeleton,
  Stack,
} from '@mantine/core';
import { useDisclosure, useFetch } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';

import NewProjectDrawer from '@/app/apps/projects/components/NewProjectDrawer';
import ProjectsCard from '@/app/apps/projects/components/ProjectsCard/ProjectsCard';
import { ErrorAlert, PageHeader } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { PATH_DASHBOARD } from '@/routes';
import { IApiResponse } from '@/types/api-response';
import { IProject } from '@/types/projects';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Projects', href: '#' },
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

function Projects() {
  const { user, isAuthenticated, permissions } = useAuth();
  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useFetch<IApiResponse<IProject[]>>('/api/projects');

  // Check if the user has a can add project
  const canAddProject = permissions?.includes('Permissions.Projects.Create');

  const [newProjectOpened, { open: newProjectOpen, close: newProjectClose }] =
    useDisclosure(false);

  const handleProjectCreated = useCallback(() => {
    refetchProjects();
  }, [refetchProjects]);

  const projectItems = projectsData?.data?.map((p: any) => (
    <ProjectsCard key={p.id} data={p} {...CARD_PROPS} />
  ));

  if (projectsLoading) {
    return (
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Projects" breadcrumbItems={items} />
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
        </Stack>
      </Container>
    );
  }

  if (projectsError) {
    return (
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Projects" breadcrumbItems={items} />
          <ErrorAlert
            title="Error loading projects"
            message={projectsError.toString()}
          />
        </Stack>
      </Container>
    );
  }

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
              canAddProject && (
                <Button
                  leftSection={<IconPlus size={18} />}
                  onClick={newProjectOpen}
                >
                  New Project
                </Button>
              )
            }
          />

          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
            {projectItems}
          </SimpleGrid>
        </Stack>
      </Container>
      <NewProjectDrawer
        opened={newProjectOpened}
        onClose={newProjectClose}
        position="right"
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
}

export default Projects;

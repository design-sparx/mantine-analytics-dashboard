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
import { useDisclosure } from '@mantine/hooks';
import { IconMoodEmpty, IconPlus } from '@tabler/icons-react';

import NewProjectDrawer from '@/app/apps/projects/components/NewProjectDrawer';
import ProjectsCard from '@/app/apps/projects/components/ProjectsCard/ProjectsCard';
import { ErrorAlert, PageHeader, Surface } from '@/components';
import { PermissionGate } from '@/lib/api/permissions';
import { type components, useProjectsWithMutations } from '@/lib/endpoints';
import { PATH_DASHBOARD } from '@/routes';

// Simplified API imports

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
  // Use new API hooks with built-in permission checking
  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
    mutations,
  } = useProjectsWithMutations();

  console.log('Projects data:', projectsData);

  const [newProjectOpened, { open: newProjectOpen, close: newProjectClose }] =
    useDisclosure(false);

  const handleProjectCreated = useCallback(() => {
    // No need to manually refetch - mutations handle this automatically
  }, []);

  const projectItems = projectsData?.data?.map(
    (p: components['schemas']['ProjectDto']) => (
      <ProjectsCard key={p.id} data={p} {...CARD_PROPS} />
    ),
  );

  const renderContent = () => {
    if (projectsLoading) {
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

    if (projectsError || !projectsData?.succeeded) {
      return (
        <ErrorAlert
          title="Error loading projects"
          message={projectsData?.errors?.join(',')}
        />
      );
    }

    if (!projectsData?.data?.length) {
      return (
        <Surface p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>No projects found</Title>
            <Text>
              You don&apos;t have any projects yet. Create one to get started.
            </Text>
            <PermissionGate permission="Permissions.Team.Projects">
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={newProjectOpen}
              >
                New Project
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
        <title>Projects | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <PageHeader
        title="Projects"
        breadcrumbItems={items}
        actionButton={
          projectsData?.data?.length && (
            <PermissionGate permission="Permissions.Team.Projects">
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={newProjectOpen}
              >
                New Project
              </Button>
            </PermissionGate>
          )
        }
      />

      {renderContent()}

      <NewProjectDrawer
        opened={newProjectOpened}
        onClose={newProjectClose}
        position="right"
        onCreate={mutations.create}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
}

export default Projects;

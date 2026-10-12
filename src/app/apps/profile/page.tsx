import {
  ActionIcon,
  Anchor,
  Badge,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  PaperProps,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBusinessplan,
  IconCoins,
  IconDotsVertical,
  IconHome,
  IconListCheck,
  IconMapPinFilled,
} from '@tabler/icons-react';

import {
  PageHeader,
  ProfileStatsCard,
  ProjectsTable,
  Surface,
  UserProfileCard,
} from '@/components';
import RevenueChart from '@/components/revenue-chart/RevenueChartClient';
import { loadMock } from '@/lib/api/mock-route';
import { PATH_DASHBOARD } from '@/routes';
import UserData from '@public/mocks/UserProfile.json';

import classes from './page.module.css';

import type { ProjectsDto } from '@/types/generated-fixtures';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Profile',
};

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Profile', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 16;

const skills = [
  'React',
  'Mantine',
  'Figma',
  'Bootstrap',
  'Typescript',
  'Sass/SCSS',
];

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

export default async function Profile() {
  const projectsResult = await loadMock<ProjectsDto[]>('Projects.json');
  const projectsData = projectsResult.data ?? [];
  const linkProps = {
    target: '_blank',
    className: classes.socialLink,
  };

  return (
    <Container fluid>
      <Stack gap="lg">
        <PageHeader title="Profile" breadcrumbItems={items} />
        <Grid>
          <GridCol span={{ base: 12, md: 5, lg: 4 }}>
            <Stack>
              <UserProfileCard data={UserData} {...PAPER_PROPS} />
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Skills
                </Text>
                <Group gap="xs">
                  {skills.map((s) => (
                    <Badge key={s} variant="filled" c="primary.8">
                      {s}
                    </Badge>
                  ))}
                </Group>
              </Surface>
              <Surface {...PAPER_PROPS}>
                <Stack>
                  <Text size="lg" fw={600}>
                    About
                  </Text>
                  <Group>
                    <IconHome size={ICON_SIZE} />
                    <Text>Lives in Nairobi, Kenya</Text>
                  </Group>
                  <Group>
                    <IconMapPinFilled size={ICON_SIZE} />
                    <Text>Works at Company ABC</Text>
                  </Group>
                </Stack>
              </Surface>
              <Surface {...PAPER_PROPS}>
                <Flex
                  direction={{ base: 'row', md: 'column' }}
                  gap={{ base: 'sm', md: 'xs' }}
                  align={{ base: 'center', md: 'stretch' }}
                >
                  <Text size="lg" fw={600}>
                    Social
                  </Text>
                  <UnstyledButton
                    component="a"
                    href="https://www.facebook.com/kelvinkk96"
                    {...linkProps}
                  >
                    <Group>
                      <IconBrandFacebook size={ICON_SIZE} />
                      <Text>Facebook</Text>
                    </Group>
                  </UnstyledButton>
                  <UnstyledButton
                    component="a"
                    href="https://twitter.com/kelvink_96"
                    {...linkProps}
                  >
                    <Group>
                      <IconBrandTwitter size={ICON_SIZE} />
                      <Text>Twitter</Text>
                    </Group>
                  </UnstyledButton>
                  <UnstyledButton
                    component="a"
                    href="https://www.linkedin.com/in/kelvink96/"
                    {...linkProps}
                  >
                    <Group>
                      <IconBrandLinkedin size={ICON_SIZE} />
                      <Text>LinkedIn</Text>
                    </Group>
                  </UnstyledButton>
                  <UnstyledButton
                    component="a"
                    href="https://github.com/kelvink96"
                    {...linkProps}
                  >
                    <Group>
                      <IconBrandGithub size={ICON_SIZE} />
                      <Text>Github</Text>
                    </Group>
                  </UnstyledButton>
                </Flex>
              </Surface>
            </Stack>
          </GridCol>
          <GridCol span={{ base: 12, md: 7, lg: 8 }}>
            <Stack>
              <RevenueChart {...PAPER_PROPS} />
              <SimpleGrid
                cols={{ base: 1, md: 1, lg: 3 }}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}
              >
                <ProfileStatsCard
                  amount={81314}
                  title="total earnings"
                  icon={IconCoins}
                  progressValue={45}
                  color="indigo.7"
                  asCurrency
                  {...PAPER_PROPS}
                />
                <ProfileStatsCard
                  amount={2532}
                  title="today's orders"
                  icon={IconListCheck}
                  progressValue={72}
                  color="teal.7"
                  {...PAPER_PROPS}
                />
                <ProfileStatsCard
                  amount={97219}
                  title="total revenue"
                  icon={IconBusinessplan}
                  progressValue={12}
                  color="lime.7"
                  asCurrency
                  {...PAPER_PROPS}
                />
              </SimpleGrid>
              <Surface {...PAPER_PROPS}>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>
                    Projects
                  </Text>
                  <ActionIcon>
                    <IconDotsVertical size={ICON_SIZE} />
                  </ActionIcon>
                </Group>
                <ProjectsTable
                  data={(projectsData ?? []).slice(0, 10)}
                  loading={false}
                  error={projectsResult.error}
                />
              </Surface>
            </Stack>
          </GridCol>
        </Grid>
      </Stack>
    </Container>
  );
}

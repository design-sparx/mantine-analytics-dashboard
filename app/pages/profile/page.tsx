"use client"

import {
  ActionIcon,
  Anchor,
  Badge,
  Container,
  Grid,
  Group,
  Paper,
  PaperProps,
  rem,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme
} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {PageHeader, ProfileStatsCard, ProjectsTable, RevenueChart, UserProfileCard} from "@/components";
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
  IconMapPinFilled
} from "@tabler/icons-react";
import ProjectsData from "@/mocks/Projects.json";
import UserData from "@/mocks/UserProfile.json";
import {Metadata} from "next";

const items = [
  {title: 'Dashboard', href: PATH_DASHBOARD.default},
  {title: 'Pages', href: '#'},
  {title: 'Profile', href: '#'},
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 16;

const skills = ['React', 'Mantine', 'Figma', 'Bootstrap', 'Typescript', 'Sass/SCSS']

const PAPER_PROPS: PaperProps = {
  p: "md",
  shadow: "md",
  radius: "md",
  style: {height: '100%'}
}

function Profile() {
  const theme = useMantineTheme();
  const linkProps = {
    target: "_blank",
    style: {
      borderRadius: theme.radius.md,
      padding: `${rem(4)} ${rem(8)}`,

      '&:hover': {
        transition: 'all ease 150ms',
        backgroundColor: theme.colors.gray[3],
        color: theme.black,
        textDecoration: 'none'
      }
    }
  };

  return (
    <>
      <head>
        <title>Profile | DesignSparx</title>
        <meta name="description"
              content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"/>
      </head>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Profile" breadcrumbItems={items}/>
          <Grid>
            <Grid.Col span={{base: 12, md: 6, lg: 3}}>
              <Stack>
                <UserProfileCard data={UserData} {...PAPER_PROPS}/>
                <Paper {...PAPER_PROPS}>
                  <Text size="lg" fw={600} mb="md">Skills</Text>
                  <Group gap="xs">
                    {skills.map(s => <Badge key={s} variant="filled" c="primary.8">{s}</Badge>)}
                  </Group>
                </Paper>
                <Paper {...PAPER_PROPS}>
                  <Stack>
                    <Text size="lg" fw={600}>About</Text>
                    <Group>
                      <IconHome size={ICON_SIZE}/>
                      <Text>Lives in Nairobi, Kenya</Text>
                    </Group>
                    <Group>
                      <IconMapPinFilled size={ICON_SIZE}/>
                      <Text>Works at Company ABC</Text>
                    </Group>
                  </Stack>
                </Paper>
                <Paper {...PAPER_PROPS}>
                  <Stack gap={4}>
                    <Text size="lg" fw={600}>Social</Text>
                    <UnstyledButton
                      component="a"
                      href="https://www.facebook.com/kelvinkk96"
                      {...linkProps}
                    >
                      <Group>
                        <IconBrandFacebook size={ICON_SIZE}/>
                        <Text>Facebook</Text>
                      </Group>
                    </UnstyledButton>
                    <UnstyledButton
                      component="a" href="https://twitter.com/kelvink_96"
                      {...linkProps}
                    >
                      <Group>
                        <IconBrandTwitter size={ICON_SIZE}/>
                        <Text>Twitter</Text>
                      </Group>
                    </UnstyledButton>
                    <UnstyledButton
                      component="a"
                      href="https://www.linkedin.com/in/kelvink96/"
                      {...linkProps}
                    >
                      <Group>
                        <IconBrandLinkedin size={ICON_SIZE}/>
                        <Text>LinkedIn</Text>
                      </Group>
                    </UnstyledButton>
                    <UnstyledButton
                      component="a"
                      href="https://github.com/kelvink96"
                      {...linkProps}
                    >
                      <Group>
                        <IconBrandGithub size={ICON_SIZE}/>
                        <Text>Github</Text>
                      </Group>
                    </UnstyledButton>
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{base: 12, md: 6, lg: 9}}>
              <Stack>
                <RevenueChart {...PAPER_PROPS}/>
                <SimpleGrid
                  cols={{base: 1, sm: 2, lg: 3}}
                  spacing={{base: 10, sm: 'xl'}}
                  verticalSpacing={{base: 'md', sm: 'xl'}}
                >
                  <ProfileStatsCard
                    amount="$ 81314"
                    title="total earnings"
                    icon={IconCoins}
                    progressValue={45}
                    color="indigo.7"
                    {...PAPER_PROPS}
                  />
                  <ProfileStatsCard
                    amount="2532"
                    title="today's orders"
                    icon={IconListCheck}
                    progressValue={72}
                    color="teal.7"
                    {...PAPER_PROPS}
                  />
                  <ProfileStatsCard
                    amount="$ 97219"
                    title="total revenue"
                    icon={IconBusinessplan}
                    progressValue={12}
                    color="lime.7"
                    {...PAPER_PROPS}
                  />
                </SimpleGrid>
                <Paper {...PAPER_PROPS}>
                  <Group justify="space-between" mb="md">
                    <Text size="lg" fw={600}>Projects</Text>
                    <ActionIcon>
                      <IconDotsVertical size={ICON_SIZE}/>
                    </ActionIcon>
                  </Group>
                  <ProjectsTable data={ProjectsData.slice(0, 10)}/>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Profile;

import React from 'react';
import Head from "next/head";
import {
    ActionIcon,
    Anchor, AnchorProps,
    Badge,
    Breadcrumbs,
    Container,
    Divider,
    Flex,
    Grid,
    Group,
    Paper, PaperProps,
    Progress, rem,
    SimpleGrid,
    Stack,
    Text, ThemeIcon,
    Title, UnstyledButton, useMantineTheme
} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {PageHeader, ProfileStatsCard, ProjectsTable, RevenueChart, UserProfileCard} from "@/components";
import UserData from "../../mocks/UserProfile.json";
import {
    IconBrandFacebook,
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconHome,
    IconMapPinFilled,
    IconListCheck,
    IconBusinessplan, IconCoins, IconDotsVertical
} from "@tabler/icons-react";
import ProjectsData from "@/mocks/Projects.json";
import {AppLayout} from "@/layout";

const items = [
    {title: 'Dashboard', href: PATH_DASHBOARD.default},
    {title: 'Pages', href: '#'},
    {title: 'Profile', href: '#'},
].map((item, index) => (
    <Anchor href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const ICON_SIZE = 18;

const skills = ['React', 'Mantine', 'Figma', 'Bootstrap', 'Typescript', 'Sass/SCSS']

const PAPER_PROPS: PaperProps = {
    p: "md",
    shadow: "md",
    radius: "md",
    sx: {height: '100%'}
}

function Profile() {
    const theme = useMantineTheme();
    const linkProps = {
        target: "_blank",
        sx: {
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
            <Head>
                <title>Profile | DesignSparx</title>
            </Head>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <PageHeader title="Profile" breadcrumbItems={items}/>
                        <Grid>
                            <Grid.Col lg={3}>
                                <Stack>
                                    <UserProfileCard data={UserData} {...PAPER_PROPS}/>
                                    <Paper {...PAPER_PROPS}>
                                        <Text size="lg" fw={600} mb="md">Skills</Text>
                                        <Group spacing="xs">
                                            {skills.map(s => <Badge key={s} variant="filled"
                                                                    color="primary.8">{s}</Badge>)}
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
                                        <Stack spacing={4}>
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
                            <Grid.Col lg={9}>
                                <Stack>
                                    <RevenueChart {...PAPER_PROPS}/>
                                    <SimpleGrid
                                        cols={3}
                                        spacing="lg"
                                        breakpoints={[
                                            {maxWidth: 'md', cols: 3, spacing: 'md'},
                                            {maxWidth: 'sm', cols: 1, spacing: 'sm'},
                                        ]}
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
                                        <Group position="apart" mb="md">
                                            <Text size="lg" fw={600}>Projects</Text>
                                            <ActionIcon>
                                                <IconDotsVertical size={ICON_SIZE}/>
                                            </ActionIcon>
                                        </Group>
                                        <ProjectsTable data={ProjectsData.slice(0, 6)}/>
                                    </Paper>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Profile;

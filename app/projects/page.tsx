import React from 'react';
import Head from "next/head";
import {AppLayout} from "@/layout";
import {Anchor, Breadcrumbs, CardProps, Container, PaperProps, SimpleGrid, Stack, Title} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import ProjectsData from "../mocks/Projects2.json"
import {PageHeader, ProjectsCard} from "@/components";

const items = [
    {title: 'Dashboard', href: PATH_DASHBOARD.default},
    {title: 'Projects', href: '#'},
].map((item, index) => (
    <Anchor href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const ICON_SIZE = 18;

const CARD_PROPS: Omit<CardProps, 'children'> = {
    p: "md",
    shadow: "md",
    radius: "md",
}

function Projects() {
    const projectItems = ProjectsData.map(p => <ProjectsCard key={p.id} {...p} {...CARD_PROPS}/>)

    return (
        <>
            <Head>
                <title>Projects | DesignSparx</title>
            </Head>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <PageHeader title="Projects" breadcrumbItems={items}/>
                        <SimpleGrid
                            cols={4}
                            spacing="lg"
                            breakpoints={[
                                { maxWidth: 'md', cols: 2, spacing: 'md' },
                                { maxWidth: 'sm', cols: 1, spacing: 'sm' },
                                { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                            ]}
                        >
                            {projectItems}
                        </SimpleGrid>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Projects;

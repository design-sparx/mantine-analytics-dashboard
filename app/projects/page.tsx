"use client"

import {Anchor, CardProps, Container, SimpleGrid, Stack} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import ProjectsData from "@/mocks/Projects2.json"
import {PageHeader, ProjectsCard} from "@/components";
import {Metadata} from "next";

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

const metadata: Metadata = {
  title: "Projects | DesignSparx",
  description: "Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!",
};

function Projects() {
  const projectItems = ProjectsData.map(p => <ProjectsCard key={p.id} {...p} {...CARD_PROPS}/>)

  return (
    <>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Projects" breadcrumbItems={items}/>
          <SimpleGrid
            cols={{base: 1, sm: 2, lg: 3, xl: 4}}
            spacing={{base: 10, sm: 'xl'}}
            verticalSpacing={{base: 'md', sm: 'xl'}}
          >
            {projectItems}
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
}

export default Projects;

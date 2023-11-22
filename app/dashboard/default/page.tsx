"use client"

import React from 'react';
import Head from "next/head";
import {Button, Container, Grid, Group, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {IconChevronRight} from "@tabler/icons-react";
import {MobileDesktopChart, PageHeader, ProjectsTable, RevenueChart, SalesChart, StatsGrid} from "@/components";
import StatsData from "../../../mocks/StatsGrid.json"
import ProjectsData from "../../../mocks/Projects.json"
import {AppLayout} from "@/layout";
import Link from "next/link";
import {PATH_TASKS} from "@/routes";
import {Metadata} from "next";

const PAPER_PROPS: PaperProps = {
  p: "md",
  shadow: "md",
  radius: "md",
  style: {height: '100%'}
}

function Page() {
  return (
    <>
      <head>
        <title>Default Dashboard | DesignSparx</title>
        <meta name="description"
              content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"/>
      </head>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Default dashboard" withActions={true}/>
          <StatsGrid data={StatsData.data} paperProps={PAPER_PROPS}/>
          <Grid gutter={{base: 5, xs: 'md', md: 'xl', xl: 50}}>
            <Grid.Col span={8}>
              <RevenueChart {...PAPER_PROPS}/>
            </Grid.Col>
            <Grid.Col span={4}>
              <SalesChart {...PAPER_PROPS}/>
            </Grid.Col>
            <Grid.Col span={4}>
              <MobileDesktopChart {...PAPER_PROPS}/>
            </Grid.Col>
            <Grid.Col span={8}>
              <Paper {...PAPER_PROPS}>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>Tasks</Text>
                  <Button
                    variant="subtle"
                    component={Link}
                    href={PATH_TASKS.root}
                    rightSection={<IconChevronRight size={18}/>}
                  >
                    View all
                  </Button>
                </Group>
                <ProjectsTable data={ProjectsData.slice(0, 6)}/>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Page;

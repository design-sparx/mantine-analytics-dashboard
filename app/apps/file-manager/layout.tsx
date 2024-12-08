'use client';

import { ReactNode } from 'react';

import { DonutChart } from '@mantine/charts';
import {
  Button,
  Container,
  Flex,
  Grid,
  Paper,
  PaperProps,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronRight, IconPointFilled } from '@tabler/icons-react';
import Link from 'next/link';

import { IFileActivity, IFolder } from '@/app/apps/file-manager/types';
import {
  resolveActionIcon,
  resolveFileIcon,
  resolveFolderIcon,
} from '@/app/apps/file-manager/utils';
import { useFetchData } from '@/hooks';

const PAPER_PROPS: PaperProps = {
  shadow: 'md',
  radius: 'md',
  p: 'md',
  mb: 'md',
};

export default function FileManagerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: foldersData,
    loading: foldersLoading,
    error: foldersError,
  } = useFetchData('/mocks/Folders.json');
  const {
    data: fileActivityData,
    loading: fileActivityLoading,
    error: fileActivityError,
  } = useFetchData('/mocks/FileActivities.json');

  const folders = foldersData.slice(0, 5).map((folder: IFolder) => {
    const Icon = resolveFolderIcon(folder.name);

    return (
      <Flex key={folder.name} component={UnstyledButton} gap="sm">
        <ThemeIcon variant="default">
          <Icon size={16} />
        </ThemeIcon>
        <Stack gap={2}>
          <Text fz="sm" fw={600}>
            {folder.name}
          </Text>
          <Flex gap={2} align="center">
            <Text fz="xs">{folder.total_files} files</Text>
            <IconPointFilled color="gray" size={12} />
            <Text fz="xs">{folder.estimated_size}</Text>
          </Flex>
        </Stack>
      </Flex>
    );
  });

  const fileActivityItems = fileActivityData.map(
    (fileActivity: IFileActivity) => {
      const ActionIcon = resolveActionIcon(fileActivity.action);
      const FileIcon = resolveFileIcon(fileActivity.file_type);

      return (
        <Timeline.Item
          key={fileActivity.id}
          bullet={<ActionIcon size={16} />}
          lineVariant="dashed"
          title={
            <Flex gap={2}>
              <Text fz="sm">{fileActivity.user}</Text>
              <Text fz="sm" tt="lowercase">
                {fileActivity.action} {fileActivity.file_type}
              </Text>
            </Flex>
          }
        >
          <Flex gap={2} direction="column">
            <Flex align="center" gap={2} component={Link} href="#">
              <FileIcon size={16} />
              <Text fz="sm">{fileActivity.file_name}</Text>
            </Flex>
            <Text fz="xs">{fileActivity.timestamp}</Text>
          </Flex>
        </Timeline.Item>
      );
    },
  );

  return (
    <>
      <>
        <title>File Manager | DesignSparx</title>
      </>
      <Container fluid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 8, xl: 9 }}>
            {children}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 3 }}>
            <Paper {...PAPER_PROPS}>
              <Title order={4} mb="md">
                Storage usage
              </Title>
              <DonutChart
                paddingAngle={8}
                data={[
                  {
                    name: 'used',
                    value: 70,
                    color: 'var(--mantine-primary-color-filled)',
                  },
                  { name: 'free', value: 30, color: 'gray.3' },
                ]}
                h={220}
                mx="auto"
                chartLabel="125GB free"
              />
              <Stack gap="xs">{folders}</Stack>
            </Paper>
            <Paper {...PAPER_PROPS}>
              <Flex align="center" justify="space-between" mb="md">
                <Title order={4}>Activity</Title>
                <Button
                  variant="subtle"
                  rightSection={<IconChevronRight size={16} />}
                >
                  See All
                </Button>
              </Flex>
              <Timeline bulletSize={30} lineWidth={2}>
                {fileActivityItems}
              </Timeline>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

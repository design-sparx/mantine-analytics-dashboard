'use client';

import React, { useMemo, useState } from 'react';

import {
  Anchor,
  Button,
  Flex,
  Input,
  Paper,
  PaperProps,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import {
  IconChevronRight,
  IconCloudUpload,
  IconEdit,
  IconFolderPlus,
  IconPhotoVideo,
  IconPlus,
  IconSearch,
  IconUpload,
  IconX,
} from '@tabler/icons-react';

import {
  ActionButton,
  FileButton,
  FilesTable,
} from '@/app/apps/file-manager/components';
import { PageHeader } from '@/components';
import { useFetchData } from '@/hooks';
import { PATH_DASHBOARD } from '@/routes';

import { IFile, IFolder } from './types';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'File manager', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 16;

const PAPER_PROPS: PaperProps = {
  shadow: 'md',
  radius: 'md',
  p: 'md',
};

function FileManager() {
  const {
    data: filesData,
    loading: filesLoading,
    error: filesError,
  } = useFetchData('/mocks/Files.json');
  const {
    data: foldersData,
    loading: foldersLoading,
    error: foldersError,
  } = useFetchData('/mocks/Folders.json');
  const [value, setValue] = useState('View all');

  const refinedFolders: IFolder[] = useMemo(() => {
    return [{ name: 'View all', pinned: true }, ...foldersData].filter(
      (folder: IFolder) => folder.pinned,
    );
  }, [foldersData]);

  return (
    <>
      <>
        <title>File Manager | DesignSparx</title>
      </>
      <Stack>
        <PageHeader title="File manager" breadcrumbItems={items} />
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <ActionButton icon={IconPlus} label="Create" asPrimary />
          <ActionButton icon={IconCloudUpload} label="Upload" />
          <ActionButton icon={IconFolderPlus} label="Create folder" />
          <ActionButton icon={IconPhotoVideo} label="Edit video" />
          <ActionButton icon={IconEdit} label="Edit PDF" />
        </SimpleGrid>
        <Paper shadow="md">
          <Dropzone
            onDrop={(files) => console.log('accepted files', files)}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={5 * 1024 ** 2}
          >
            <Flex
              direction="column"
              justify="center"
              align="center"
              gap="md"
              p="md"
              mih={80}
              style={{ pointerEvents: 'none' }}
            >
              <Dropzone.Accept>
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: 'var(--mantine-color-blue-6)',
                  }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: 'var(--mantine-color-red-6)',
                  }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: 'var(--mantine-color-dimmed)',
                  }}
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text>Click or drag and drop your file(s) here</Text>
              </div>
            </Flex>
          </Dropzone>
        </Paper>
        <Paper {...PAPER_PROPS}>
          <Flex justify="space-between" align="center" mb="md">
            <Title order={4}>Recently modified</Title>
            <Button
              variant="subtle"
              rightSection={<IconChevronRight size={16} />}
            >
              See all
            </Button>
          </Flex>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            {filesData.slice(0, 4).map((file: IFile) => (
              <FileButton key={file.id} file={file} />
            ))}
          </SimpleGrid>
        </Paper>
        <Paper {...PAPER_PROPS}>
          <Title order={4} mb="md">
            All files
          </Title>
          <Flex
            align={{ base: 'flex-start', lg: 'center' }}
            justify="space-between"
            direction={{ base: 'column', lg: 'row' }}
            mb="md"
            gap="sm"
          >
            <SegmentedControl
              value={value}
              onChange={setValue}
              data={refinedFolders.map((folder: IFolder) => ({
                label: folder.name,
                value: folder.name,
              }))}
            />
            <Input
              leftSection={<IconSearch size={ICON_SIZE} />}
              placeholder="Search"
            />
          </Flex>
          <FilesTable
            data={
              value === 'View all'
                ? filesData
                : filesData.filter((file: IFile) => file.type === value)
            }
            error={filesError}
            loading={filesLoading}
          />
        </Paper>
      </Stack>
    </>
  );
}

export default FileManager;

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
import { PageHeader, Surface } from '@/components';
import { useApiGet } from '@/lib/hooks/useApiGet';
import { PATH_DASHBOARD } from '@/routes';
import { API_CORE } from '@/routes/api';

import { IFile, IFileType, IFolder, IFolderType } from './types';

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
  p: 'md',
};

export function FileManager() {
  const {
    data: filesData,
    loading: filesLoading,
    error: filesError,
  } = useApiGet<IFile[]>(API_CORE.files);
  const {
    data: foldersData,
    loading: foldersLoading,
    error: foldersError,
  } = useApiGet<IFolder[]>(API_CORE.folders);
  const [value, setValue] = useState('View all');

  const refinedFolders: IFolder[] = useMemo(() => {
    const viewAllFolder = {
      id: 'view-all',
      name: 'View all' as IFolderType,
      icon: 'Documents' as IFileType,
      description: '',
      permissions: '',
      created_at: '',
      pinned: true,
      total_files: 0,
      estimated_size: '',
    };
    return [viewAllFolder, ...(foldersData ?? [])].filter(
      (folder: IFolder) => folder.pinned,
    );
  }, [foldersData]);

  return (
    <Stack>
      <PageHeader title="File manager" breadcrumbItems={items} />
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
        <ActionButton icon={IconPlus} label="Create" asPrimary />
        <ActionButton icon={IconCloudUpload} label="Upload" />
        <ActionButton icon={IconFolderPlus} label="Create folder" />
        <ActionButton icon={IconPhotoVideo} label="Edit video" />
        <ActionButton icon={IconEdit} label="Edit PDF" />
      </SimpleGrid>
      <Surface>
        <Dropzone onDrop={() => {}} onReject={() => {}} maxSize={5 * 1024 ** 2}>
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
      </Surface>
      <Surface {...PAPER_PROPS}>
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
          {(filesData ?? []).slice(0, 4).map((file: IFile) => (
            <FileButton key={file.id} file={file} />
          ))}
        </SimpleGrid>
      </Surface>
      <Surface {...PAPER_PROPS}>
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
              ? filesData ?? []
              : (filesData ?? []).filter((file: IFile) => file.type === value)
          }
          error={filesError?.message}
          loading={filesLoading}
        />
      </Surface>
    </Stack>
  );
}

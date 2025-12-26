import { Flex, PaperProps, Stack, Text } from '@mantine/core';
import { IconPointFilled } from '@tabler/icons-react';

import { IFile } from '@/app/apps/file-manager/types';
import { Surface } from '@/components';

import classes from './FileButton.module.css';
import { resolveFileIcon } from '../../utils';

type FileButtonProps = PaperProps & {
  file: IFile;
};

export function FileButton({ file, ...others }: FileButtonProps) {
  const Icon = resolveFileIcon(file.type);

  return (
    <Surface className={classes.wrapper} {...others}>
      <Icon size={18} />
      <Stack gap={2}>
        <Text fz="sm" fw={700}>
          {file.name}
        </Text>
        <Flex gap={4} align="center">
          <Text fz="xs" tt="uppercase">
            {file.size}
          </Text>
          <IconPointFilled color="gray" size={10} />
          <Text fz="xs" tt="lowercase">
            {file.type}
          </Text>
        </Flex>
      </Stack>
    </Surface>
  );
}

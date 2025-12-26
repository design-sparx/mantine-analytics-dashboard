'use client';

import {
  Avatar,
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  MantineColor,
  PaperProps,
  Progress,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconNotebook, IconShare } from '@tabler/icons-react';

import { Surface } from '@/components';
import type { ProjectDto } from '@/types';

import classes from './ProjectsCard.module.css';

const avatars = [
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
];

type Status =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'on hold'
  | 'in progress'
  | 'archived'
  | 'suspended'
  | 'expired'
  | string;

type StatusProps = {
  status: Status;
};

const StatusBadge = ({ status }: StatusProps) => {
  let color: MantineColor;

  switch (status) {
    case 'expired':
      color = 'dark';
      break;
    case 'active':
      color = 'green';
      break;
    case 'cancelled':
      color = 'gray';
      break;
    case 'archived':
      color = 'gray';
      break;
    case 'inactive':
      color = 'dark';
      break;
    case 'completed':
      color = 'green';
      break;
    case 'in progress':
      color = 'indigo';
      break;
    case 'pending':
      color = 'yellow.8';
      break;
    case 'suspended':
      color = 'red';
      break;
    case 'on hold':
      color = 'pink';
      break;
    default:
      color = 'gray';
  }

  return (
    <Badge color={color} variant="filled" radius="sm">
      {status}
    </Badge>
  );
};

type ProjectsCardProps = {
  data: ProjectDto;
} & Omit<PaperProps, 'children'>;

const ProjectsCard = (props: ProjectsCardProps) => {
  const { data, ...others } = props;

  if (!data) {
    return null;
  }

  // Map ProjectDto fields to display values
  const name = data.title || 'Untitled Project';
  const startDate = data.startDate ? new Date(data.startDate).toLocaleDateString() : 'Not set';
  const endDate = data.dueDate ? new Date(data.dueDate).toLocaleDateString() : 'Not set';
  const assignee = data.owner?.userName || data.owner?.email || 'Unassigned';
  const state = data.status ?? 0; // ProjectState is a number

  // Map state number to status text
  const getStatusText = (stateNum: number) => {
    switch (stateNum) {
      case 0: return 'pending';
      case 1: return 'in progress';
      case 2: return 'completed';
      case 3: return 'on hold';
      case 4: return 'cancelled';
      default: return 'pending';
    }
  };

  const statusText = getStatusText(state);

  return (
    <Surface {...others}>
      <Stack gap="sm">
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="xs">
            <Text fz="md" fw={600}>
              {name}
            </Text>
          </Flex>
          <StatusBadge status={statusText.toLowerCase()} />
        </Flex>

        <Stack gap="xs">
          <Text fz="sm" c="dimmed">
            <Text span fw={500}>Start:</Text> {startDate}
          </Text>
          <Text fz="sm" c="dimmed">
            <Text span fw={500}>End:</Text> {endDate}
          </Text>
        </Stack>

        <Flex align="center" gap="xs">
          <Tooltip label={assignee}>
            <Avatar size="md" radius="xl">
              {assignee.substring(0, 2).toUpperCase()}
            </Avatar>
          </Tooltip>
          <div>
            <Text fz="xs" c="dimmed">Assigned to</Text>
            <Text fz="sm" fw={500}>{assignee}</Text>
          </div>
        </Flex>

        <Divider />

        <Group gap="sm">
          <Button
            size="compact-md"
            variant="subtle"
            leftSection={<IconShare size={14} />}
          >
            Share
          </Button>
          <Button
            size="compact-md"
            variant="subtle"
            leftSection={<IconNotebook size={14} />}
          >
            Learn More
          </Button>
        </Group>
      </Stack>
    </Surface>
  );
};

export default ProjectsCard;

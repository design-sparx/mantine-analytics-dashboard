import { ReactNode } from 'react';

import {
  Avatar,
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

import classes from './UserButton.module.css';

type UserProfileButtonProps = {
  image: string;
  name: string;
  email: string;
  icon?: ReactNode;
  asAction?: boolean;
  showText?: boolean;
} & UnstyledButtonProps;

const UserProfileButton = ({
  image,
  name,
  email,
  icon,
  asAction,
  showText = true,
  ...others
}: UserProfileButtonProps) => {
  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        <Avatar src={image} radius="xl" />

        {showText && (
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {name}
            </Text>

            <Text size="xs">{email}</Text>
          </div>
        )}

        {icon && asAction && <IconChevronRight size="0.9rem" stroke={1.5} />}
      </Group>
    </UnstyledButton>
  );
};

export default UserProfileButton;

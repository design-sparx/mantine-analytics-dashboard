import {
  Avatar,
  Flex,
  Indicator,
  Stack,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import classes from './ChatsList.module.css';

type ChatsListProps = {
  avatar: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
} & UnstyledButtonProps;

const ChatsList = ({
  avatar,
  lastName,
  lastMessage,
  firstName,
}: ChatsListProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');

  return tablet_match ? (
    <UnstyledButton className={classes.itemRounded}>
      <Flex align="center" gap="xs">
        <Indicator position="bottom-end" color="green" offset={5} size={9}>
          <Avatar size="md" radius="50%" src={avatar} />
        </Indicator>
        <Text size="sm">
          {firstName} {lastName}
        </Text>
      </Flex>
    </UnstyledButton>
  ) : (
    <UnstyledButton className={classes.item}>
      <Flex align="center" gap="xs">
        <Indicator position="bottom-end" color="green" offset={5} size={9}>
          <Avatar size="md" radius="50%" src={avatar} />
        </Indicator>
        <Stack gap={1}>
          <Text size="sm" fw={600} lineClamp={1}>
            {firstName} {lastName}
          </Text>
          <Text lineClamp={1} size="xs" c="dimmed">
            {lastMessage}
          </Text>
        </Stack>
      </Flex>
    </UnstyledButton>
  );
};

export default ChatsList;

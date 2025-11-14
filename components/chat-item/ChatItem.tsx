import { Avatar, Box, BoxProps, Flex, Skeleton, Text } from '@mantine/core';

import { Surface } from '@/components';

import classes from './ChatItem.module.css';

type ChatItemProps = {
  id: string;
  fullName: string;
  avatar: string;
  sent_time: string;
  message: string;
  sender: boolean;
  loading?: boolean;
} & BoxProps;

const ChatItem = (props: ChatItemProps) => {
  const {
    id,
    avatar,
    message,
    fullName,
    sender,
    sent_time,
    loading,
    ...others
  } = props;
  const isMe = fullName.toLowerCase() === 'you';

  return loading ? (
    <Flex gap="sm">
      <Skeleton height={48} circle mb="xl" />
      <Skeleton height={60} />
    </Flex>
  ) : (
    <Box {...others}>
      <Flex gap="xs">
        <Avatar src={avatar} radius="50%" />
        <Box>
          <Surface
            p="sm"
            className={isMe ? classes.isMeChatItem : classes.chatItem}
          >
            <Text
              size="sm"
              fw={600}
              tt="capitalize"
              mb={4}
              c={isMe ? 'white' : 'initial'}
            >
              {fullName}
            </Text>
            <Text size="sm" c={isMe ? 'white' : 'initial'}>
              {message}
            </Text>
          </Surface>
          <Text ta="end" size="sm" mt={4}>
            {sent_time}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default ChatItem;

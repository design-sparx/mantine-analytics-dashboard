import {Avatar, Flex, Indicator, Stack, Text, UnstyledButton, UnstyledButtonProps} from "@mantine/core";

type ChatsListProps = {
    avatar: string
    firstName: string
    lastName: string
    lastMessage: string
} & UnstyledButtonProps

const ChatsList = ({avatar, lastName, lastMessage, firstName}: ChatsListProps) => {
    return (
        <UnstyledButton p={2}>
            <Flex align="center" gap="xs">
                <Indicator position="bottom-end" color="green" offset={6}>
                    <Avatar
                        size="md"
                        radius="50%"
                        src={avatar}
                    />
                </Indicator>
                <Stack spacing={1}>
                    <Text size="sm">{firstName} {lastName}</Text>
                    <Text lineClamp={1} size="sm">{lastMessage}</Text>
                </Stack>
            </Flex>
        </UnstyledButton>
    );
};

export default ChatsList;

import {Avatar, Box, BoxProps, Flex, Paper, Text, useMantineTheme} from "@mantine/core";

type ChatItemProps = {
    id: string,
    fullName: string,
    avatar: string,
    sent_time: string,
    message: string,
    sender: boolean
} & BoxProps

const ChatItem = (props: ChatItemProps) => {
    const {id, avatar, message, fullName, sender, sent_time, ...others} = props
    const theme = useMantineTheme()
    const isMe = fullName.toLowerCase() === 'you'

    return (
        <Box {...others}>
            <Flex gap="xs">
                <Avatar src={avatar} radius="50%"/>
                <Box>
                    <Paper
                        p="sm"
                        sx={{
                            backgroundColor: isMe ? theme.colors[theme.primaryColor][7] : theme.colors.gray[1],
                            color: isMe ? theme.white : theme.black
                        }}
                    >
                        <Text size="sm" fw={600} tt="capitalize" mb={4}>{fullName}</Text>
                        <Text size="sm">{message}</Text>
                    </Paper>
                    <Text align="end" size="sm" mt={4}>{sent_time}</Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default ChatItem;

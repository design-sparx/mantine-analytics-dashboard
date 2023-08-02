import {Avatar, Box, BoxProps, Flex, Paper, Text} from "@mantine/core";

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

    return (
        <Box {...others}>
            <Flex>
                <Avatar src={avatar} radius="50%"/>
                <Box>
                    <Paper withBorder>
                        <Text size="sm">{fullName}</Text>
                        <Text size="sm">{message}</Text>
                    </Paper>
                    <Text align="end" size="xs">{sent_time}</Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default ChatItem;

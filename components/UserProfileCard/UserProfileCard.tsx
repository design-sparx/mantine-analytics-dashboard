import {Avatar, Button, Paper, Text, Title} from '@mantine/core';

interface UserInfoActionProps {
    data: {
        avatar: string;
        name: string;
        email: string;
        job: string;
    }
}

const UserProfileCard = ({data: {avatar, name, email, job}}: UserInfoActionProps) => {
    return (
        <Paper
            radius="md"
            withBorder
            p="lg"
            sx={(theme) => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
            })}
        >
            <Title>Profile details</Title>
            <Avatar src={avatar} size={120} radius={120} mx="auto"/>
            <Text ta="center" fz="lg" weight={500} mt="md">
                {name}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
                {email}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
                {job}
            </Text>

            <Button variant="default" fullWidth mt="md">
                Send message
            </Button>
        </Paper>
    );
}

export default UserProfileCard

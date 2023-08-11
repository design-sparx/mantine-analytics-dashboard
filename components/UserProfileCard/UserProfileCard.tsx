import {Avatar, Button, Paper, PaperProps, Text, Title} from '@mantine/core';

type UserInfoActionProps = {
    data: {
        avatar: string;
        name: string;
        email: string;
        job: string;
    }
} & PaperProps

const UserProfileCard = ({data: {avatar, name, email, job}, ...others}: UserInfoActionProps) => {
    return (
        <Paper{...others}>
            <Text size="lg" fw={600} mb="md">Profile details</Text>
            <Avatar src={avatar} size={120} radius={120} mx="auto" mb="md"/>
            <Text ta="center" fz="md" weight={500} mt="md">
                {name}
            </Text>
            <Text ta="center" c="dimmed" fz="xs">
                {email}
            </Text>
            <Text ta="center" c="dimmed" fz="xs">
                {job}
            </Text>

            <Button variant="outline" fullWidth mt="md">
                Send message
            </Button>
        </Paper>
    );
}

export default UserProfileCard

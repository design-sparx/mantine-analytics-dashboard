import { Avatar, Button, Paper, PaperProps, Stack, Text } from '@mantine/core';
import { Surface } from '@/components';
import { IconSend } from '@tabler/icons-react';

type UserInfoActionProps = {
  data: {
    avatar: string;
    name: string;
    email: string;
    job: string;
  };
} & PaperProps;

const UserProfileCard = ({
  data: { avatar, name, email, job },
  ...others
}: UserInfoActionProps) => {
  return (
    <Surface component={Paper} {...others}>
      <Stack gap={4} align="center">
        <Text size="lg" fw={600} mb="md">
          Profile details
        </Text>
        <Avatar src={avatar} size={120} radius={120} mx="auto" mb="md" />
        <Text fz="md" fw={500} mt="md" mx="auto">
          {name}
        </Text>
        <Text c="dimmed" fz="xs" component="a" href={`mailto:${email}`}>
          {email}
        </Text>
        <Text c="dimmed" fz="xs" ta="center">
          {job}
        </Text>

        <Button
          variant="outline"
          fullWidth
          mt="md"
          rightSection={<IconSend size={14} />}
        >
          Send message
        </Button>
      </Stack>
    </Surface>
  );
};

export default UserProfileCard;

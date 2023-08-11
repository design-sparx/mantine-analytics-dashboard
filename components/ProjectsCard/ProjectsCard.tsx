import {
    Avatar,
    Badge,
    Button,
    Card,
    CardProps,
    Divider,
    Flex,
    Group,
    Image,
    MantineColor,
    Progress,
    Stack,
    Text, Tooltip
} from "@mantine/core";

const avatars = [
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
];

type Status =
    "active"
    | "inactive"
    | "pending"
    | "completed"
    | "cancelled"
    | "on hold"
    | "in progress"
    | "archived"
    | "suspended"
    | "expired"
    | string

type StatusProps = {
    status: Status
}

const StatusBadge = ({status}: StatusProps) => {
    let color: MantineColor = '';

    switch (status) {
        case 'expired':
            color = "dark"
            break;
        case 'active':
            color = "green"
            break;
        case 'cancelled':
            color = "gray"
            break;
        case 'archived':
            color = "gray"
            break;
        case 'inactive':
            color = "dark"
            break;
        case 'completed':
            color = "green"
            break;
        case 'in progress':
            color = "indigo"
            break;
        case 'pending':
            color = "yellow.8"
            break;
        case 'suspended':
            color = "red"
            break;
        case 'on hold':
            color = "pink"
            break;
        default:
            color = "gray"
    }

    return (
        <Badge color={color} variant="filled" radius="sm">{status}</Badge>
    )
}

type ProjectsCardProps = {
    id: string,
    title: string,
    description: string,
    status: Status,
    image: string | null,
    completion: number,
} & Omit<CardProps, 'children'>

const ProjectsCard = (props: ProjectsCardProps) => {
    const {id, status, completion, description, title, image, ...others} = props

    return (
        <Card {...others}>
            <Stack spacing="sm">
                <Flex justify="space-between" align="center">
                    <Flex align="center" gap="xs">
                        {image && <Image src={image} width={20} height={20} radius="50%"/>}
                        <Text fz="md" fw={600}>
                            {title}
                        </Text>
                    </Flex>
                    <StatusBadge status={status}/>
                </Flex>
                <Text fz="sm" lineClamp={3}>
                    {description}
                </Text>

                <Text fz="sm">
                    Tasks completed:{' '}
                    <Text
                        span
                        fw={500}
                        sx={(theme) => ({color: theme.colorScheme === 'dark' ? theme.white : theme.black})}
                    >
                        {completion}/100
                    </Text>
                </Text>

                <Progress value={completion} mt={5} size="sm"/>

                <Avatar.Group spacing="sm">
                    <Tooltip label="Anne Doe">
                        <Avatar src={avatars[0]} size="md" radius="xl"/>
                    </Tooltip>
                    <Tooltip label="Alex Doe">
                        <Avatar src={avatars[1]} size="md" radius="xl"/>
                    </Tooltip>
                    <Tooltip label="Abby Doe">
                        <Avatar src={avatars[2]} size="md" radius="xl"/>
                    </Tooltip>
                    <Tooltip label="and 5 others">
                        <Avatar size="md" radius="xl">+5</Avatar>
                    </Tooltip>
                </Avatar.Group>
                <Card.Section>
                    <Divider/>
                </Card.Section>
                <Group spacing="sm">
                    <Button compact variant="subtle">Share</Button>
                    <Button compact variant="subtle">Learn More</Button>
                </Group>
            </Stack>
        </Card>
    );
};

export default ProjectsCard;

import {Button, Group, List, Paper, PaperProps, rem, Text, ThemeIcon, Title} from '@mantine/core';
import {IconArrowRight, IconCheck} from '@tabler/icons-react';
import CountUp from 'react-countup';

type PricingCardProps = {
    tier: string,
    description: string;
    price: {
        month: number,
        year: number
    },
    features: string[],
    preferred: boolean,
    actionText: string,
    monthly: boolean,
} & PaperProps

const PricingCard = (props: PricingCardProps) => {
    const {price, actionText, preferred, features, tier, monthly, description, ...others} = props;

    return (
        <Paper {...others}>
            <Group spacing={4} position="center">
                <sup style={{fontSize: rem(24)}}>$</sup>
                <Group align="flex-end" spacing={1}>
                    <Title size={48}><CountUp end={monthly ? price.year : price.month}/></Title>
                    <Text size="md" fw={500} mb={6}>/mo</Text>
                </Group>
            </Group>
            <Title ta="center" my="md" tt="capitalize" order={3}>{tier}</Title>
            <Text ta="center">{description}</Text>
            <List
                spacing="xs"
                size="md"
                center
                my="xl"
                icon={
                    <ThemeIcon size={24} radius="xl" variant="light">
                        <IconCheck size={16}/>
                    </ThemeIcon>
                }
            >
                {features.map((f, i) => <List.Item key={`${f}-${i}`} mb="md">{f}</List.Item>)}
            </List>
            <Button
                variant={preferred ? "filled" : "outline"}
                rightIcon={<IconArrowRight size={20}/>}
                fullWidth
                size="md"
                mb="sm"
                sx={{textTransform: 'capitalize'}}
            >
                {actionText}
            </Button>
            <Text ta="center" color="dimmed" size="sm">No card required</Text>
        </Paper>
    );
};

export default PricingCard

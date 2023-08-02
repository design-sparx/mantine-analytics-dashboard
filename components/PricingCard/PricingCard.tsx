import {Badge, Button, List, Paper, PaperProps, ThemeIcon, Title} from '@mantine/core';
import {IconArrowRight, IconCheck} from '@tabler/icons-react';

type PricingCardProps = {
    tier: string,
    price: {
        month: number,
        year: number
    },
    features: string[],
    preferred: boolean,
    actionText: string,
    monthly: boolean,
} & PaperProps

const PricingCard = ({price, actionText, preferred, features, tier, monthly}: PricingCardProps) => {
    return (
        <Paper>
            <Badge size="md">{tier}</Badge>
            <Title mb="md">${monthly ? price.year : price.month}<small>/mo</small></Title>
            <List
                spacing="xs"
                size="sm"
                center
                mb="md"
                icon={
                    <ThemeIcon size={24} radius="xl" variant="light">
                        <IconCheck size={16}/>
                    </ThemeIcon>
                }
            >
                {features.map((f, i) => <List.Item key={`${f}-${i}`}>{f}</List.Item>)}
            </List>
            <Button
                variant={preferred ? "filled" : "outline"}
                rightIcon={<IconArrowRight size={18}/>}
            >
                {actionText}
            </Button>
        </Paper>
    );
};

export default PricingCard

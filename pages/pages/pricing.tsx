import React, {useState} from 'react';
import Head from "next/head";
import {
    Anchor,
    Breadcrumbs,
    Button,
    Container,
    Flex,
    Paper,
    PaperProps,
    SimpleGrid,
    Stack,
    Switch,
    Text,
    Title
} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {Faqs, PageHeader, PricingCard} from "@/components";
import {AppLayout} from "@/layout";
import {IconChevronRight} from "@tabler/icons-react";

const items = [
    {title: 'Dashboard', href: PATH_DASHBOARD.default},
    {title: 'Pages', href: '#'},
    {title: 'Pricing', href: '#'},
].map((item, index) => (
    <Anchor href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const ICON_SIZE = 18;

const PAPER_PROPS: PaperProps = {
    p: "md",
    shadow: "md",
    radius: "md",
    sx: {height: '100%'}
}

const PRICING = [
    {
        tier: 'basic',
        price: {
            month: 0,
            year: 0
        },
        features: ['Rich landing pages', '100+ components'],
        preferred: false,
        actionText: 'start for free',
        description: 'All the basics for starting a new business'
    },
    {
        tier: 'standard',
        price: {
            month: 25,
            year: 45
        },
        features: ['Rich landing pages', '100+ components', 'Flexible licensing', 'Speedy build tooling', '6 months free support'],
        preferred: true,
        actionText: 'start with standard',
        description: 'Everything you need for a growing business'
    },
    {
        tier: 'premium',
        price: {
            month: 40,
            year: 70
        },
        features: ['Rich landing pages', '100+ components', 'Flexible licensing', 'Speedy build tooling', '6 months free support', '256-bit encryption', 'Guaranteed 100% uptime', 'Unlimited users'],
        preferred: false,
        actionText: 'start with premium',
        description: 'Advanced features for scaling your business'
    },
]

function Pricing() {
    const [checked, setChecked] = useState(false);
    const pricingItems = PRICING.map(p => <PricingCard key={p.tier} monthly={checked} {...p} {...PAPER_PROPS}/>)

    return (
        <>
            <Head>
                <title>Pricing | DesignSparx</title>
            </Head>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <PageHeader title="Pricing" breadcrumbItems={items}/>
                        <Paper sx={{backgroundColor: 'transparent'}}>
                            <Stack>
                                <Title order={2} ta="center">Simple, fair pricing.</Title>
                                <Text size="lg" ta="center">All types of businesses need access to development
                                    resources, so we give you the option to decide how much you need to use.</Text>
                                <Flex justify="center" gap="md">
                                    <Text>Annual</Text>
                                    <Switch
                                        size="md"
                                        checked={checked}
                                        onChange={(event) => setChecked(event.currentTarget.checked)}
                                    />
                                    <Text>Monthly</Text>
                                </Flex>
                            </Stack>
                        </Paper>
                        <SimpleGrid
                            cols={3}
                            spacing="lg"
                            breakpoints={[
                                {maxWidth: 'lg', cols: 3, spacing: 'lg'},
                                {maxWidth: 'md', cols: 1, spacing: 'md'},
                                {maxWidth: 'sm', cols: 1, spacing: 'sm'},
                            ]}
                        >{pricingItems}</SimpleGrid>
                        <Paper {...PAPER_PROPS}>
                            <Faqs/>
                        </Paper>
                        <Paper sx={{backgroundColor: 'transparent'}} p="md">
                            <Stack align="center" spacing="xs">
                                <Text>Still have questions?</Text>
                                <Button variant="subtle" rightIcon={<IconChevronRight size={18}/>}>Contact Us</Button>
                            </Stack>
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Pricing;

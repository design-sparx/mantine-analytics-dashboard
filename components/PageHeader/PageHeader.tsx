import React from 'react';
import {ActionIcon, Breadcrumbs, Button, Divider, Flex, Group, Paper, Stack, Text, Title} from "@mantine/core";
import {IconPlus, IconRefresh} from "@tabler/icons-react";
import {FilterDateMenu} from "@/components";

type PageHeaderProps = {
    title: string;
    withActions?: boolean;
    breadcrumbItems?: any;
    invoiceAction?: boolean;
}

const PageHeader = ({withActions, breadcrumbItems, title, invoiceAction}: PageHeaderProps) => {
    return (
        <>
            <Paper sx={{backgroundColor: 'transparent'}}>
                {withActions ? <Group position="apart">
                        <Stack spacing="sm">
                            <Title order={3}>{title}</Title>
                            <Text>Welcome back, Kelvin!</Text>
                        </Stack>
                        <Group>
                            <ActionIcon>
                                <IconRefresh size={18}/>
                            </ActionIcon>
                            <FilterDateMenu/>
                        </Group>
                    </Group> :
                    (invoiceAction ?
                            <Flex align="center" justify="space-between">
                                <Stack>
                                    <Title order={3}>{title}</Title>
                                    <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
                                </Stack>
                                <Button leftIcon={<IconPlus size={18}/>}>New Invoice</Button>
                            </Flex>
                            : <Stack spacing="sm">
                                <Title order={3}>{title}</Title>
                                <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
                            </Stack>
                    )}
            </Paper>
            <Divider/>
        </>
    )
};

export default PageHeader;
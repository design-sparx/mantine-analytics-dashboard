import React from 'react';
import {ActionIcon, Breadcrumbs, Divider, Group, Paper, Stack, Text, Title} from "@mantine/core";
import {IconRefresh} from "@tabler/icons-react";
import {FilterDateMenu} from "@/components";

type PageHeaderProps = {
    title: string;
    withActions?: boolean;
    breadcrumbItems?: any;
}

const PageHeader = ({withActions, breadcrumbItems, title}: PageHeaderProps) => {
    return (
        <>
            <Paper sx={{backgroundColor: 'transparent'}}>
                {withActions ?
                    <Group position="apart">
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
                    <Stack spacing="sm">
                        <Title order={3}>{title}</Title>
                        <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
                    </Stack>
                }
            </Paper>
            <Divider/>
        </>
    )
};

export default PageHeader;
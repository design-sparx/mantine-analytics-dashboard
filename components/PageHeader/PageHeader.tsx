import React from 'react';
import {
    ActionIcon,
    Breadcrumbs,
    BreadcrumbsProps,
    Button,
    Divider,
    Flex,
    Group,
    Paper, rem,
    Stack,
    Text,
    Title, useMantineTheme
} from "@mantine/core";
import {IconPlus, IconRefresh} from "@tabler/icons-react";
import {FilterDateMenu} from "@/components";

type PageHeaderProps = {
    title: string;
    withActions?: boolean;
    breadcrumbItems?: any;
    invoiceAction?: boolean;
}

const PageHeader = ({withActions, breadcrumbItems, title, invoiceAction}: PageHeaderProps) => {
    const theme = useMantineTheme()
    const BREADCRUMBS_PROPS: Omit<BreadcrumbsProps, 'children'> = {
        sx: {
            'a': {
                padding: rem(8),
                borderRadius: theme.radius.md,
                fontWeight: 500,
                color: theme.black,

                '&:hover': {
                    transition: 'all ease 150ms',
                    backgroundColor: theme.colors.gray[3],
                    color: theme.black,
                    textDecoration: 'none'
                }
            }
        }
    }

    return (
        <>
            <Paper sx={{backgroundColor: 'transparent'}}>
                {withActions ?
                    <Flex
                        justify="space-between"
                        direction={{base: 'column', sm: 'row'}}
                        gap={{base: 'sm', sm: 4}}
                    >
                        <Stack spacing={4}>
                            <Title order={3}>{title}</Title>
                            <Text>Welcome back, Kelvin!</Text>
                        </Stack>
                        <Flex align="center" gap="sm">
                            <ActionIcon color="primary">
                                <IconRefresh size={18}/>
                            </ActionIcon>
                            <FilterDateMenu/>
                        </Flex>
                    </Flex> :
                    (invoiceAction ?
                            <Flex
                                align="center"
                                justify="space-between"
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                            >
                                <Stack>
                                    <Title order={3}>{title}</Title>
                                    <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
                                </Stack>
                                <Button leftIcon={<IconPlus size={18}/>}>New Invoice</Button>
                            </Flex> :
                            <Stack spacing="sm">
                                <Title order={3}>{title}</Title>
                                <Breadcrumbs {...BREADCRUMBS_PROPS}>{breadcrumbItems}</Breadcrumbs>
                            </Stack>
                    )}
            </Paper>
            <Divider/>
        </>
    )
};

export default PageHeader;
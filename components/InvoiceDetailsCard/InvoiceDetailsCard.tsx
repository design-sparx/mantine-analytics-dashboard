import React from 'react';
import {Invoices} from "@/types";
import {
    Button,
    Divider,
    Flex,
    Menu,
    Paper,
    PaperProps,
    Stack,
    Table,
    Text,
    TextProps,
    useMantineTheme
} from "@mantine/core";
import {IconCloudDownload, IconMail, IconPrinter, IconSend, IconShare} from "@tabler/icons-react";
import {useMediaQuery} from "@mantine/hooks";

const ICON_SIZE = 16

type InvoiceDetailsProps = {
    data?: Invoices
} & PaperProps

const elements = [
    {description: 'Front and rear brake cables', unitPrice: 100, amount: 100},
    {description: 'New set of pedal arms', unitPrice: 25, amount: 25},
    {description: 'Labor - 3hrs', unitPrice: 15, amount: 15},
];

const TEXT_PROPS: TextProps = {
    fz: "sm"
}

const InvoiceDetails = ({data, ...others}: InvoiceDetailsProps) => {
    const theme = useMantineTheme()
    const LINK_PROPS: TextProps = {
        color: theme.colors[theme.primaryColor][7]
    }
    const tablet_match = useMediaQuery('(max-width: 768px)');

    const rows = elements.map((element) => (
        <tr key={element.description}>
            <td>{element.description}</td>
            <td>${element.unitPrice}</td>
            <td>${element.amount}</td>
        </tr>
    ));

    return (
        <Paper {...others}>
            {data ?
                <Stack>
                    <Flex gap="sm" justify="flex-end">
                        <Button leftIcon={<IconCloudDownload size={ICON_SIZE}/>} variant="subtle">Download</Button>
                        <Button leftIcon={<IconPrinter size={ICON_SIZE}/>} variant="subtle">Print</Button>
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <Button leftIcon={<IconShare size={ICON_SIZE}/>} variant="subtle">Share</Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item icon={<IconMail size={14}/>}>Send email</Menu.Item>
                                <Menu.Item icon={<IconSend size={14}/>}>Forward in chat</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Flex>
                    <Text  {...TEXT_PROPS}>Hello {data.full_name},</Text>
                    <Text  {...TEXT_PROPS}>This is the invoice for a payment of ${data.amount} you made
                        to {data.client_company}</Text>
                    <Flex
                        justify="space-between"
                        direction={{base: 'column', sm: 'row'}}
                        gap={{base: 'sm', sm: 4}}
                    >
                        <Stack spacing={4}>
                            <Text {...TEXT_PROPS} fw={600}>Payment No</Text>
                            <Text {...TEXT_PROPS}>{data.id}</Text>
                        </Stack>
                        <Stack spacing={4} sx={{textAlign: tablet_match ? 'start' : 'end'}}>
                            <Text {...TEXT_PROPS} fw={600}>Payment Date</Text>
                            <Text {...TEXT_PROPS}>{data.issue_date}</Text>
                        </Stack>
                    </Flex>
                    <Divider/>
                    <Flex
                        justify="space-between"
                        direction={{base: 'column', sm: 'row'}}
                        gap={{base: 'sm', sm: 4}}
                    >
                        <Stack spacing={4}>
                            <Text {...TEXT_PROPS} fw={600}>Client</Text>
                            <Text {...TEXT_PROPS}>{data.client_name}</Text>
                            <Text {...TEXT_PROPS}>{data.client_address}</Text>
                            <Text {...TEXT_PROPS}>{data.client_country}</Text>
                            <Text
                                component="a"
                                href={`mailto:${data.client_email}`}
                                {...TEXT_PROPS}
                                {...LINK_PROPS}
                            >
                                {data.client_email}</Text>
                        </Stack>
                        <Stack spacing={4} sx={{textAlign: tablet_match ? 'start' : 'end'}}>
                            <Text {...TEXT_PROPS} fw={600}>Paid to</Text>
                            <Text {...TEXT_PROPS}>{data.client_company}</Text>
                            <Text {...TEXT_PROPS}>{data.address}</Text>
                            <Text {...TEXT_PROPS}>{data.country}</Text>
                            <Text
                                component="a"
                                href={`mailto:${data.email}`}
                                {...TEXT_PROPS}
                                {...LINK_PROPS}
                            >
                                {data.email}
                            </Text>
                        </Stack>
                    </Flex>
                    <Divider/>
                    <Table
                        striped
                        horizontalSpacing="sm"
                        verticalSpacing="sm"
                    >
                        <thead>
                        <tr>
                            <th>Description</th>
                            <th>Unit Price</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        <tr>
                            <td></td>
                            <td>Subtotal</td>
                            <td>$140</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Shipping</td>
                            <td>$5</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Discount</td>
                            <td>2.5%</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Total</td>
                            <td>$137.75</td>
                        </tr>
                        </tbody>
                    </Table>
                    <Text ta="center" fz="sm" c="dimmed" mt="md">Extra note: Please send all items at the same time to
                        the
                        shipping address. Thanks in advance.</Text>
                </Stack> :
                <p>Invoice not selected</p>
            }
        </Paper>
    );
};

export default InvoiceDetails;

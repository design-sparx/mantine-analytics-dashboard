import React from 'react';
import {Invoices} from "@/types";
import {Button, Divider, Flex, Menu, Paper, Stack, Table, Text} from "@mantine/core";
import {IconCloudDownload, IconMail, IconPrinter, IconSend, IconShare} from "@tabler/icons-react";

const ICON_SIZE = 16

type InvoiceDetailsProps = {
    data?: Invoices
}

const elements = [
    {description: 'Front and rear brake cables', unitPrice: 100, amount: 100},
    {description: 'New set of pedal arms', unitPrice: 25, amount: 25},
    {description: 'Labor - 3hrs', unitPrice: 15, amount: 15},
];

const InvoiceDetails = ({data}: InvoiceDetailsProps) => {
    const rows = elements.map((element) => (
        <tr key={element.description}>
            <td>{element.description}</td>
            <td>${element.unitPrice}</td>
            <td>${element.amount}</td>
        </tr>
    ));

    return (
        <Paper>
            {data ?
                <Stack>
                    <Flex gap="sm">
                        <Button leftIcon={<IconCloudDownload size={ICON_SIZE}/>}>Download</Button>
                        <Button leftIcon={<IconPrinter size={ICON_SIZE}/>}>Print</Button>
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <Button leftIcon={<IconShare size={ICON_SIZE}/>}>Share</Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item icon={<IconMail size={14}/>}>Send email</Menu.Item>
                                <Menu.Item icon={<IconSend size={14}/>}>Forward in chat</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Flex>
                    <Text>Hello {data.full_name},</Text>
                    <Text>This is the invoice for a payment of ${data.amount} you made to {data.client_company}</Text>
                    <Flex>
                        <Stack>
                            <Text>Payment No</Text>
                            <Text>{data.id}</Text>
                        </Stack>
                        <Stack>
                            <Text>Payment Date</Text>
                            <Text>{data.issue_date}</Text>
                        </Stack>
                    </Flex>
                    <Divider/>
                    <Flex>
                        <Stack>
                            <Text>Client</Text>
                            <Text>{data.client_name}</Text>
                            <Text>{data.client_address}</Text>
                            <Text>{data.client_country}</Text>
                            <Text>{data.client_email}</Text>
                        </Stack>
                        <Stack>
                            <Text>Payment to</Text>
                            <Text>{data.client_company}</Text>
                            <Text>{data.address}</Text>
                            <Text>{data.country}</Text>
                            <Text>{data.email}</Text>
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
                    <Text>Extra note: Please send all items at the same time to the shipping address. Thanks in advance.</Text>
                </Stack> :
                <p>Invoice not selected</p>
            }
        </Paper>
    );
};

export default InvoiceDetails;

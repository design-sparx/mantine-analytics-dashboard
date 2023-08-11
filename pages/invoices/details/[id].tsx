import React, {useEffect, useState} from 'react';
import Head from "next/head";
import {AppLayout} from "@/layout";
import {Anchor, Container, PaperProps, Stack} from "@mantine/core";
import {InvoiceDetailsCard, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {PATH_DASHBOARD, PATH_INVOICES} from "@/routes";
import {useRouter} from "next/router";
import {Invoices} from "@/types";

const items = [
    {title: 'Dashboard', href: PATH_DASHBOARD.default},
    {title: 'Invoices', href: PATH_INVOICES.invoices.all},
    {title: 'Details', href: '#'},
].map((item, index) => (
    <Anchor href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const PAPER_PROPS: PaperProps = {
    p: "md",
    shadow: "md",
    radius: "md",
}

function InvoiceDetails() {
    const router = useRouter()
    const [selectedData, setSelectedData] = useState<Invoices>();

    useEffect(() => {
        setSelectedData(InvoicesData.find(_ => _.id === router.query.id))
    }, [router, InvoicesData]);

    return (
        <>
            <Head>
                <title>Invoice - {selectedData?.id} | DesignSparx</title>
            </Head>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <PageHeader
                            title={`Invoice #${selectedData?.id.slice(0, 7)}`}
                            breadcrumbItems={items}
                        />
                        <InvoiceDetailsCard data={selectedData} {...PAPER_PROPS}/>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default InvoiceDetails;

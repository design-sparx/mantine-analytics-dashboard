import React, {useState} from 'react';
import Head from "next/head";
import {
    Anchor, Box,
    Breadcrumbs,
    Button,
    Container,
    FileButton,
    Grid,
    Group,
    Image,
    Paper, PaperProps,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title
} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {useForm} from "@mantine/form";
import {IconCloudUpload} from "@tabler/icons-react";
import {AppLayout} from "@/layout";
import {PageHeader} from "@/components";

const items = [
    {title: 'Dashboard', href: PATH_DASHBOARD.default},
    {title: 'Pages', href: '#'},
    {title: 'Settings', href: '#'},
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

function Settings() {
    const [file, setFile] = useState<File | null>(null);
    const accountForm = useForm({
        initialValues: {
            username: 'kelvinkiprop',
            biograghy: 'I\'m a software engineering graduate with a passion for transforming ideas into simple applications. I love experimenting with new technologies. Right now, I\'m working on building and shipping business automation solutions at Alternate Limited.\n',
        },
    });
    const accountInfoForm = useForm({
        initialValues: {
            firstname: 'kelvin',
            lastname: 'kiprop',
            email: 'kelvin.kiprop96@gmail.com',
            address: '',
            apartment: '',
            city: '',
            state: '',
            zip: ''
        },
    });

    return (
        <>
            <Head>
                <title>Settings | DesignSparx</title>
            </Head>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <PageHeader title="Settings" breadcrumbItems={items}/>
                        <Paper {...PAPER_PROPS}>
                            <Text size="lg" fw={600} mb="md">User information</Text>
                            <Grid>
                                <Grid.Col lg={9}>
                                    <Stack>
                                        <TextInput
                                            label="User Name"
                                            placeholder="user name" {...accountForm.getInputProps('username')}
                                        />
                                        <Textarea
                                            mt="md"
                                            label="Biography"
                                            placeholder="Biography"
                                            minRows={4}
                                            {...accountForm.getInputProps('biograghy')}
                                        />
                                        <Button sx={{width: 'fit-content'}}>Save Changes</Button>
                                    </Stack>
                                </Grid.Col>
                                <Grid.Col lg={3}>
                                    <Stack align="center">
                                        <Image
                                            src="https://res.cloudinary.com/ddh7hfzso/image/upload/v1690925057/me/v0zcdrmf6myw75ehijkb.jpg"
                                            height={120}
                                            width={120}
                                            radius="50%"
                                        />
                                        <FileButton onChange={setFile} accept="image/png,image/jpeg">
                                            {(props) =>
                                                <Button
                                                    {...props}
                                                    variant="subtle"
                                                    leftIcon={<IconCloudUpload size={ICON_SIZE}/>}
                                                >
                                                    Upload image
                                                </Button>
                                            }
                                        </FileButton>
                                        <Text align="center" size="xs" color="dimmed">For best results, use an image at
                                            least 128px by 128px in .jpg format</Text>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Paper>
                        <Paper {...PAPER_PROPS}>
                            <Stack>
                                <Text size="lg" fw={600}>Account information</Text>
                                <Group grow>
                                    <TextInput
                                        label="First name"
                                        placeholder="first name" {...accountInfoForm.getInputProps('firstname')}
                                    />
                                    <TextInput
                                        label="Last name"
                                        placeholder="last name" {...accountInfoForm.getInputProps('lastname')}
                                    />
                                </Group>
                                <TextInput
                                    label="Email"
                                    placeholder="email" {...accountInfoForm.getInputProps('email')}
                                />
                                <TextInput
                                    label="Address"
                                    placeholder="address" {...accountInfoForm.getInputProps('address')}
                                />
                                <TextInput
                                    label="Apartment/Studio/Floor"
                                    placeholder="apartment, studio, or floor" {...accountInfoForm.getInputProps('apartment')}
                                />
                                <Group grow>
                                    <TextInput
                                        label="City"
                                        placeholder="city" {...accountInfoForm.getInputProps('city')}
                                    />
                                    <TextInput
                                        label="State"
                                        placeholder="state" {...accountInfoForm.getInputProps('state')}
                                    />
                                    <TextInput
                                        label="Zip"
                                        placeholder="zip" {...accountInfoForm.getInputProps('zip')}
                                    />
                                </Group>
                                <Box sx={{width: 'auto'}}>
                                    <Button>Save changes</Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Settings;

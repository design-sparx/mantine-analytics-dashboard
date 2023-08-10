import React from 'react';
import Head from "next/head";
import {
    ActionIcon,
    Anchor,
    Box, Button,
    Container,
    Divider,
    Flex,
    Grid,
    Paper, PaperProps,
    rem,
    ScrollArea,
    Stack,
    TextInput, Tooltip,
    useMantineTheme
} from "@mantine/core";
import {RichTextEditor, Link} from '@mantine/tiptap';
import {useEditor, BubbleMenu} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {PATH_DASHBOARD} from "@/routes";
import {ChatItem, ChatsList, PageHeader} from "@/components";
import {IconSearch, IconSend} from "@tabler/icons-react";
import ChatsListData from "../../mocks/ChatsList.json"
import ChatItemsData from "../../mocks/ChatItems.json"
import {AppLayout} from "@/layout";

const items = [
    {title: 'Dashboard', href: PATH_DASHBOARD.default},
    {title: 'Pages', href: '#'},
    {title: 'Chat', href: '#'},
].map((item, index) => (
    <Anchor href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const ICON_SIZE = 18;

const PAPER_PROPS: PaperProps = {
    shadow: "md",
    radius: "md",
}

function Chat() {
    const theme = useMantineTheme();
    const editor = useEditor({
        extensions: [StarterKit, Link, Placeholder.configure({placeholder: 'Type your message'})],
        content: '<p>Select some text to see bubble menu</p>',
    });

    return (
        <>
            <Head>
                <title>Chats | DesignSparx</title>
            </Head>
            <AppLayout>
                <Container fluid>
                    <Stack>
                        <PageHeader title="Settings" breadcrumbItems={items}/>
                        <Paper component="div" {...PAPER_PROPS} sx={{height: rem(500)}}>
                            <Grid gutter={0}>
                                <Grid.Col lg={3}>
                                    <Stack py="md">
                                        <Box px="sm">
                                            <TextInput
                                                aria-label="search contact"
                                                placeholder="search contacts"
                                                icon={<IconSearch size={14}/>}
                                            />
                                        </Box>
                                        <Stack spacing={0}>
                                            {ChatsListData.map(c =>
                                                <ChatsList
                                                    key={c.id}
                                                    lastMessage={c.last_message}
                                                    firstName={c.first_name}
                                                    lastName={c.last_name}
                                                    avatar={c.avatar}
                                                />
                                            )}
                                        </Stack>
                                    </Stack>
                                </Grid.Col>
                                <Grid.Col lg={9}>
                                    <Box sx={{borderLeft: `1px solid ${theme.colors.gray[3]}`}}>
                                        <ScrollArea h={415}>
                                            <Stack px="lg" py="xl">
                                                {ChatItemsData.map(c =>
                                                    <ChatItem
                                                        key={c.id}
                                                        avatar={c.avatar}
                                                        id={c.id}
                                                        message={c.message}
                                                        fullName={c.sender ? 'you' : `${c?.first_name} ${c.last_name}`}
                                                        sender={c.sender}
                                                        sent_time={c.sent_time}
                                                        ml={c.sender ? 'auto' : 0}
                                                        sx={{maxWidth: '70%'}}
                                                    />
                                                )}
                                            </Stack>
                                        </ScrollArea>
                                        <Divider/>
                                        <Paper p="sm">
                                            <Flex gap="sm" align="center">
                                                <RichTextEditor editor={editor} sx={{flex: 1}}>
                                                    {editor && (
                                                        <BubbleMenu editor={editor}>
                                                            <RichTextEditor.ControlsGroup>
                                                                <RichTextEditor.Bold/>
                                                                <RichTextEditor.Italic/>
                                                                <RichTextEditor.Link/>
                                                            </RichTextEditor.ControlsGroup>
                                                        </BubbleMenu>
                                                    )}
                                                    <RichTextEditor.Content/>
                                                </RichTextEditor>
                                                <Tooltip label="Send message">
                                                    <ActionIcon
                                                        title="send message"
                                                        variant="filled"
                                                        size="xl"
                                                        radius="xl"
                                                        color={theme.colors[theme.primaryColor][7]}
                                                        disabled={!Boolean(editor?.getText())}
                                                    >
                                                        <IconSend size={24}/>
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Flex>
                                        </Paper>
                                    </Box>
                                </Grid.Col>
                            </Grid>
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Chat;

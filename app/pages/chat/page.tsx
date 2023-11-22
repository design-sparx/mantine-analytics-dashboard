"use client"

import {
  ActionIcon,
  Anchor,
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  Paper,
  PaperProps,
  rem,
  ScrollArea,
  Stack,
  TextInput,
  Tooltip,
  useMantineTheme
} from "@mantine/core";
import {Link, RichTextEditor} from '@mantine/tiptap';
import {BubbleMenu, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {PATH_DASHBOARD} from "@/routes";
import {ChatItem, ChatsList, PageHeader, Surface, UserButton} from "@/components";
import {IconDotsVertical, IconSearch, IconSend} from "@tabler/icons-react";
import {useColorScheme, useMediaQuery} from "@mantine/hooks";
import {Carousel} from "@mantine/carousel";
import {Metadata} from "next";
import ChatsListData from "@/mocks/ChatsList.json"
import ChatItemsData from "@/mocks/ChatItems.json"
import UserProfileData from ".././../../mocks/UserProfile.json";

import classes from "./page.module.css";

const items = [
  {title: 'Dashboard', href: PATH_DASHBOARD.default},
  {title: 'Pages', href: '#'},
  {title: 'Chat', href: '#'},
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 16;

const PAPER_PROPS: PaperProps = {
  shadow: "md",
  radius: "md",
}

function Chat() {
  const theme = useMantineTheme();
  const colorScheme = useColorScheme()
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const editor = useEditor({
    extensions: [StarterKit, Link, Placeholder.configure({placeholder: 'Type your message'})],
    content: '<p>Type your message here. Select some text to see a bubble menu</p>',
  });

  return (
    <>
      <head>
        <title>Chat | DesignSparx</title>
        <meta name="description"
              content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"/>
      </head>
      <Container fluid>
        <Stack>
          <PageHeader title="Settings" breadcrumbItems={items}/>
          <Surface component={Paper} {...PAPER_PROPS} style={{height: tablet_match ? 'auto' : rem(565)}}>
            <Grid gutter={0}>
              <Grid.Col span={{base: 12, md: 4, lg: 3}}>
                <Stack py="md" style={{height: "100%"}}>
                  <Box px="sm">
                    <TextInput
                      aria-label="search contact"
                      placeholder="search contacts"
                      leftSection={<IconSearch size={14}/>}
                    />
                  </Box>
                  {tablet_match ?
                    <>
                      <Carousel
                        height='100%'
                        align="start"
                        slidesToScroll={1}
                        px={32}
                        slideSize={{base: '100%', sm: '37.5%', md: '22.5%', lg: "25%"}}
                        slideGap={{base: 0, sm: 'md', md: "md", lg: "lg"}}
                      >
                        {ChatsListData.map(c =>
                          <Carousel.Slide key={`carousel-${c.id}`}>
                            <ChatsList
                              lastMessage={c.last_message}
                              firstName={c.first_name}
                              lastName={c.last_name}
                              avatar={c.avatar}
                            />
                          </Carousel.Slide>
                        )}
                      </Carousel>
                      <Divider/>
                    </> : <Stack gap={0}>
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
                  }
                </Stack>
              </Grid.Col>
              <Grid.Col span={{base: 12, md: 8, lg: 9}}>
                <Box
                  className={classes.chatItems}
                  style={{borderLeft: tablet_match ? 'none' : `1px solid ${theme.colors.gray[3]}`}}
                >
                  <Box className={classes.chatHeader}>
                    <Flex align="center" justify="space-between">
                      <UserButton
                        email={UserProfileData.email}
                        image={UserProfileData.avatar}
                        name={UserProfileData.name}
                        asAction={false}
                        className={classes.user}
                      />
                      <Flex gap="sm">
                        <ActionIcon variant="subtle">
                          <IconSearch size={16}/>
                        </ActionIcon>
                        <ActionIcon variant="subtle">
                          <IconDotsVertical size={16}/>
                        </ActionIcon>
                      </Flex>
                    </Flex>
                  </Box>
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
                          style={{maxWidth: tablet_match ? '100%' : '70%'}}
                        />
                      )}
                    </Stack>
                  </ScrollArea>
                  <Divider/>
                  <Box className={classes.replyBox}>
                    <Flex gap="sm" align="center">
                      <RichTextEditor editor={editor} style={{flex: 1}}>
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
                  </Box>
                </Box>
              </Grid.Col>
            </Grid>
          </Surface>
        </Stack>
      </Container>
    </>
  );
}

export default Chat;

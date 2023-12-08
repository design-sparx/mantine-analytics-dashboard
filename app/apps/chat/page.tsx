'use client';

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
  Skeleton,
  Stack,
  TextInput,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { BubbleMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { PATH_DASHBOARD } from '@/routes';
import {
  ChatItem,
  ChatsList,
  ErrorAlert,
  PageHeader,
  Surface,
  UserButton,
} from '@/components';
import { IconDotsVertical, IconSearch, IconSend } from '@tabler/icons-react';
import { useColorScheme, useMediaQuery } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import ChatsListData from '@/public/mocks/ChatsList.json';
import ChatItemsData from '@/public/mocks/ChatItems.json';
import UserProfileData from '@/public/mocks/UserProfile.json';
import { useFetchData } from '@/hooks';

import classes from './page.module.css';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Chat', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 16;

const PAPER_PROPS: PaperProps = {
  shadow: 'md',
  radius: 'md',
};

function Chat() {
  const theme = useMantineTheme();
  const colorScheme = useColorScheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({ placeholder: 'Type your message' }),
    ],
    content: '<p>Select some text to see a bubble menu</p>',
  });
  const {
    data: chatsListData,
    loading: chatsListLoading,
    error: chatsListError,
  } = useFetchData('/mocks/ChatsList.json');
  const {
    data: chatItemsData,
    loading: chatsItemsLoading,
    error: chatsItemsError,
  } = useFetchData('/mocks/ChatItems.json');

  return (
    <>
      <>
        <title>Chat | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack>
          <PageHeader title="Chat" breadcrumbItems={items} />
          <Surface
            component={Paper}
            {...PAPER_PROPS}
            style={{ height: tablet_match ? 'auto' : rem(565) }}
          >
            <Grid gutter={0}>
              <Grid.Col span={{ base: 12, sm: 3, md: 4, lg: 3 }}>
                <Stack py="md" style={{ height: '100%' }}>
                  <Box px="sm">
                    <TextInput
                      aria-label="search contact"
                      placeholder="search contacts"
                      leftSection={<IconSearch size={14} />}
                    />
                  </Box>
                  {tablet_match ? (
                    <>
                      <Carousel
                        height="100%"
                        align="start"
                        slidesToScroll={1}
                        px={32}
                        slideSize={{
                          base: '27.5%',
                          sm: '37.5%',
                          md: '22.5%',
                          lg: '25%',
                        }}
                        slideGap={{ base: 0, sm: 'md', md: 'md', lg: 'lg' }}
                      >
                        {chatsListLoading ? (
                          Array.from({ length: 6 }).map((o, i) => (
                            <Carousel.Slide
                              key={`chat-carousel-list-${i}`}
                              mr="md"
                            >
                              <Skeleton height={48} />
                            </Carousel.Slide>
                          ))
                        ) : chatsListError ? (
                          <ErrorAlert
                            title="Error loading chats"
                            message={chatsListError.toString()}
                          />
                        ) : (
                          chatsListData.length > 0 &&
                          chatsListData.map((c: any) => (
                            <Carousel.Slide key={`carousel-${c.id}`}>
                              <ChatsList
                                lastMessage={c.last_message}
                                firstName={c.first_name}
                                lastName={c.last_name}
                                avatar={c.avatar}
                              />
                            </Carousel.Slide>
                          ))
                        )}
                      </Carousel>
                      <Divider />
                    </>
                  ) : (
                    <Stack gap={0}>
                      {chatsListLoading ? (
                        Array.from({ length: 6 }).map((o, i) => (
                          <Box key={`chat-list-${i}`}>
                            <Skeleton height={48} radius={0} />
                            <Divider />
                          </Box>
                        ))
                      ) : chatsListError ? (
                        <ErrorAlert
                          title="Error loading chats"
                          message={chatsListError.toString()}
                        />
                      ) : (
                        chatsListData.length > 0 &&
                        chatsListData.map((c: any) => (
                          <ChatsList
                            key={c.id}
                            lastMessage={c.last_message}
                            firstName={c.first_name}
                            lastName={c.last_name}
                            avatar={c.avatar}
                          />
                        ))
                      )}
                    </Stack>
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 9, md: 8, lg: 9 }}>
                <Box className={classes.chatItems}>
                  <Box className={classes.chatHeader}>
                    <Skeleton visible={chatsListLoading || chatsItemsLoading}>
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
                            <IconSearch size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Flex>
                      </Flex>
                    </Skeleton>
                  </Box>
                  <ScrollArea h={415}>
                    <Stack px="lg" py="xl">
                      {chatsItemsError ? (
                        <ErrorAlert
                          title="Error loading chat"
                          message={chatsItemsError.toString()}
                        />
                      ) : (
                        chatItemsData.length > 0 &&
                        chatItemsData.map((c: any) => (
                          <ChatItem
                            key={c.id}
                            avatar={c.avatar}
                            id={c.id}
                            message={c.message}
                            fullName={
                              c.sender
                                ? 'you'
                                : `${c?.first_name} ${c.last_name}`
                            }
                            sender={c.sender}
                            sent_time={c.sent_time}
                            ml={c.sender ? 'auto' : 0}
                            style={{ maxWidth: tablet_match ? '100%' : '70%' }}
                            loading={chatsItemsLoading}
                          />
                        ))
                      )}
                    </Stack>
                  </ScrollArea>
                  <Divider />
                  <Box className={classes.replyBox}>
                    <Flex gap="sm" align="center">
                      <Skeleton visible={chatsListLoading || chatsItemsLoading}>
                        <RichTextEditor editor={editor} style={{ flex: 1 }}>
                          {editor && (
                            <BubbleMenu editor={editor}>
                              <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold />
                                <RichTextEditor.Italic />
                                <RichTextEditor.Link />
                              </RichTextEditor.ControlsGroup>
                            </BubbleMenu>
                          )}
                          <RichTextEditor.Content />
                        </RichTextEditor>
                      </Skeleton>
                      <Tooltip label="Send message">
                        <ActionIcon
                          title="send message"
                          variant="filled"
                          size="xl"
                          radius="xl"
                          color={theme.colors[theme.primaryColor][7]}
                          disabled={!Boolean(editor?.getText())}
                          loading={chatsListLoading || chatsItemsLoading}
                        >
                          <IconSend size={24} />
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

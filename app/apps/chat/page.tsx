'use client';

import { useEffect, useMemo, useState } from 'react';

import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  PaperProps,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Tooltip,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Link, RichTextEditor } from '@mantine/tiptap';
import {
  IconDotsVertical,
  IconPlus,
  IconSearch,
  IconSend,
} from '@tabler/icons-react';
import Placeholder from '@tiptap/extension-placeholder';
import { BubbleMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import {
  ChatItem,
  ChatsList,
  ErrorAlert,
  PageHeader,
  Surface,
} from '@/components';
import { useAuth } from '@/hooks/useAuth';
import {
  type components,
  useChatMessagesWithMutations,
  useChatsWithMutations,
} from '@/lib/endpoints';
import { PATH_DASHBOARD } from '@/routes';

import { NewChatModal } from './components/NewChatModal';
import classes from './page.module.css';

type ChatDto = components['schemas']['ChatDto'];
type ChatMessageDto = components['schemas']['ChatMessageDto'];

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Chat', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const PAPER_PROPS: PaperProps = {};

function Chat() {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [
    newChatModalOpened,
    { open: openNewChatModal, close: closeNewChatModal },
  ] = useDisclosure(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({ placeholder: 'Type your message' }),
    ],
    content: '',
  });

  // Fetch chats list
  const {
    data: chatsData,
    loading: chatsListLoading,
    error: chatsListError,
    mutations: chatMutations,
  } = useChatsWithMutations();

  const chatsListData = useMemo(() => chatsData?.data || [], [chatsData?.data]);

  // Fetch messages for selected chat
  const {
    data: messagesData,
    loading: chatsItemsLoading,
    error: chatsItemsError,
    mutations: messageMutations,
  } = useChatMessagesWithMutations(selectedChatId || '');

  const chatItemsData = messagesData?.data || [];

  // Select first chat by default
  useEffect(() => {
    if (chatsListData.length > 0 && !selectedChatId) {
      setSelectedChatId(chatsListData[0].id || null);
    }
  }, [chatsListData, selectedChatId]);

  const handleCreateChat = async (chatData: Partial<ChatDto>) => {
    await chatMutations.create(chatData);
  };

  const handleSendMessage = async () => {
    if (!editor || !selectedChatId) return;

    const content = editor.getText().trim();
    if (!content) return;

    const messageData: Partial<ChatMessageDto> = {
      chat_id: selectedChatId,
      sender_id: user?.id,
      content,
      message_type: 1, // Text message
    };

    await messageMutations.send(messageData);
    editor.commands.clearContent();
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

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
          <PageHeader
            title="Chat"
            breadcrumbItems={items}
            actionButton={
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={openNewChatModal}
              >
                New Chat
              </Button>
            }
          />
          <Surface
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
                          chatsListData.map((c: ChatDto) => (
                            <Carousel.Slide key={`carousel-${c.id}`}>
                              <ChatsList
                                lastMessage={
                                  c.last_message || 'No messages yet'
                                }
                                firstName={c.name || 'Unknown'}
                                lastName=""
                                avatar=""
                                isSelected={c.id === selectedChatId}
                                onClick={() => handleSelectChat(c.id || '')}
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
                        chatsListData.map((c: ChatDto) => (
                          <ChatsList
                            key={c.id}
                            lastMessage={c.last_message || 'No messages yet'}
                            firstName={c.name || 'Unknown'}
                            lastName=""
                            avatar=""
                            isSelected={c.id === selectedChatId}
                            onClick={() => handleSelectChat(c.id || '')}
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
                      <Stack gap="xs">
                        <Flex align="center" justify="space-between">
                          <div>
                            <Text size="lg" fw={600}>
                              {chatsListData.find(
                                (c) => c.id === selectedChatId,
                              )?.name || 'Select a chat'}
                            </Text>
                            <Text size="xs" c="dimmed">
                              You can send messages to yourself for notes and
                              reminders
                            </Text>
                          </div>
                          <Flex gap="sm">
                            <ActionIcon variant="subtle">
                              <IconSearch size={16} />
                            </ActionIcon>
                            <ActionIcon variant="subtle">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Flex>
                        </Flex>
                      </Stack>
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
                        chatItemsData.map((c: ChatMessageDto) => (
                          <ChatItem
                            key={c.id}
                            avatar=""
                            id={c.id || ''}
                            message={c.content || ''}
                            fullName={
                              c.sender_id === user?.id ? 'You' : 'Participant'
                            }
                            sender={c.sender_id === user?.id}
                            sent_time={c.created_at || ''}
                            ml={c.sender_id === user?.id ? 'auto' : 0}
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
                          disabled={
                            !Boolean(editor?.getText()) || !selectedChatId
                          }
                          loading={chatsListLoading || chatsItemsLoading}
                          onClick={handleSendMessage}
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

      <NewChatModal
        opened={newChatModalOpened}
        onClose={closeNewChatModal}
        onSubmit={handleCreateChat}
        loading={chatsListLoading}
      />
    </>
  );
}

export default Chat;

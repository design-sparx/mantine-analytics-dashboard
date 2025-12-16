'use client';

import { useEffect } from 'react';

import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import type { ChatDto } from '@/types';

type NewChatModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (chat: Partial<ChatDto>) => void;
  loading?: boolean;
};

export const NewChatModal = ({
  opened,
  onClose,
  onSubmit,
  loading = false,
}: NewChatModalProps) => {
  const form = useForm<{
    name: string;
  }>({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value) =>
        value.trim().length === 0 ? 'Chat name is required' : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const newChat: Partial<ChatDto> = {
      name: values.name,
      type: 1, // Default to 1-on-1 chat type
    };

    onSubmit(newChat);
    form.reset();
    onClose();
  };

  useEffect(() => {
    if (!opened) {
      form.reset();
    }
  }, [opened, form]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Start New Chat"
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Chat Name"
            placeholder="Enter chat name or participant name"
            required
            {...form.getInputProps('name')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Start Chat
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

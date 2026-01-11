'use client';

import { useState } from 'react';

import {
  Button,
  Drawer,
  DrawerProps,
  LoadingOverlay,
  Stack,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconSend } from '@tabler/icons-react';

interface ComposeEmailFormValues {
  to: string;
  cc: string;
  subject: string;
  body: string;
}

type ComposeEmailProps = Omit<DrawerProps, 'title' | 'children'> & {
  onEmailSent?: () => void;
  replyTo?: {
    to: string;
    subject: string;
  };
};

export const ComposeEmail = ({
  onEmailSent,
  replyTo,
  ...drawerProps
}: ComposeEmailProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<ComposeEmailFormValues>({
    mode: 'controlled',
    initialValues: {
      to: replyTo?.to || '',
      cc: '',
      subject: replyTo?.subject ? `Re: ${replyTo.subject}` : '',
      body: '',
    },
    validate: {
      to: isEmail('Invalid email address'),
      subject: isNotEmpty('Subject cannot be empty'),
      body: isNotEmpty('Email body cannot be empty'),
    },
  });

  const handleSubmit = async (values: ComposeEmailFormValues) => {
    setLoading(true);
    try {
      // Note: In this mock template, emails are read-only from JSON files
      // For a real implementation, you would send a POST request here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      notifications.show({
        title: 'Email Sent',
        message: 'Your email has been sent successfully!',
        color: 'green',
      });

      form.reset();

      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      if (onEmailSent) {
        onEmailSent();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to send email',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer {...drawerProps} title="Compose Email" size="lg">
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Title order={4}>New Message</Title>
          <TextInput
            label="To"
            placeholder="recipient@email.com"
            key={form.key('to')}
            {...form.getInputProps('to')}
            required
          />
          <TextInput
            label="CC"
            placeholder="cc@email.com (optional)"
            key={form.key('cc')}
            {...form.getInputProps('cc')}
          />
          <TextInput
            label="Subject"
            placeholder="Email subject"
            key={form.key('subject')}
            {...form.getInputProps('subject')}
            required
          />
          <Textarea
            label="Message"
            placeholder="Type your message here..."
            minRows={10}
            key={form.key('body')}
            {...form.getInputProps('body')}
            required
          />

          <Button
            type="submit"
            mt="md"
            loading={loading}
            leftSection={<IconSend size={16} />}
          >
            Send Email
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

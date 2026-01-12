export interface EmailDto {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  important: boolean;
  folder: EmailFolder;
  labels?: string[];
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam';

export interface EmailComposeDto {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
}

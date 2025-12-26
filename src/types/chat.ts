export interface ChatDto {
  id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
  sent_time?: string;
  last_message?: string;
  type?: number;
}

export interface ChatMessageDto {
  id?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  sent_time?: string;
  message?: string;
  content?: string;
  sender?: boolean;
  sender_id?: string;
  chat_id?: string;
  message_type?: number;
  created_at?: string;
}

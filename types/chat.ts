export interface ChatDto {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  sent_time: string;
  last_message: string;
}

export interface ChatMessageDto {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  sent_time: string;
  message: string;
  sender: boolean;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'client';
  status: 'sent' | 'delivered' | 'read';
  read: boolean;
}

export interface Client {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  online?: boolean;
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
}

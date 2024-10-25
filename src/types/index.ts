export interface Client {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastPing: string;
  greetingMessage: string;
}

export interface Message {
  id: string;
  clientId: string;
  content: string;
  speaker: 'user' | 'ai';
  timestamp: string;
  mediaUrl?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  chatworkId?: string;
  lineId?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'pdf';
  uploadedAt: string;
}

export interface KeywordCondition {
  keywords: string[];
  operator: 'and' | 'or';
}

export interface KeywordTrigger {
  id: string;
  clientId: string;
  conditions: KeywordCondition[];
  action: {
    type: 'message' | 'media' | 'email' | 'chatwork';
    message?: string;
    mediaUrl?: string;
    userIds?: string[];
  };
}

export interface Customer {
  id: string;
  clientId: string;
  messageId: string;
  photo?: string;
  firstContact: string;
  lastContact: string;
  totalConversations: number;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
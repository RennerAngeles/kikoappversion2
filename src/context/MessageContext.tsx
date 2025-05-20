import React, { createContext, useContext, useState, useCallback } from 'react';
import { Message, Conversation } from '../types';

interface MessageContextType {
  messages: Message[];
  conversations: Conversation[];
  getUnreadCount: (conversationId: string, userId: string) => number;
  markAsRead: (messageId: string) => void;
  markConversationAsRead: (conversationId: string, userId: string) => void;
  startConversation: (buyerId: string, sellerId: string, productId: string) => Promise<string>;
  sendMessage: (conversationId: string, senderId: string, content: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('conversations');
    return saved ? JSON.parse(saved) : [];
  });

  const saveMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    localStorage.setItem('messages', JSON.stringify(newMessages));
  };

  const saveConversations = (newConversations: Conversation[]) => {
    setConversations(newConversations);
    localStorage.setItem('conversations', JSON.stringify(newConversations));
  };

  const getUnreadCount = useCallback((conversationId: string, userId: string) => {
    return messages.filter(message => 
      message.conversationId === conversationId &&
      message.receiverId === userId && 
      !message.read
    ).length;
  }, [messages]);

  const markAsRead = useCallback((messageId: string) => {
    const updatedMessages = messages.map(message =>
      message.id === messageId ? { ...message, read: true } : message
    );
    saveMessages(updatedMessages);
  }, [messages]);

  const markConversationAsRead = useCallback((conversationId: string, userId: string) => {
    const updatedMessages = messages.map(message =>
      message.conversationId === conversationId && message.receiverId === userId
        ? { ...message, read: true }
        : message
    );
    saveMessages(updatedMessages);
  }, [messages]);

  const startConversation = useCallback(async (buyerId: string, sellerId: string, productId: string): Promise<string> => {
    // Check if conversation already exists
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(buyerId) && 
      conv.participants.includes(sellerId) && 
      conv.productId === productId
    );

    if (existingConversation) {
      return existingConversation.id;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: Math.random().toString(36).substring(2, 11),
      participants: [buyerId, sellerId],
      productId,
      createdAt: new Date(),
    };

    saveConversations([...conversations, newConversation]);
    return newConversation.id;
  }, [conversations]);

  const sendMessage = useCallback(async (conversationId: string, senderId: string, content: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const receiverId = conversation.participants.find(id => id !== senderId);
    if (!receiverId) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 11),
      conversationId,
      senderId,
      receiverId,
      content,
      createdAt: new Date(),
      read: false,
    };

    saveMessages([...messages, newMessage]);
  }, [conversations, messages]);

  return (
    <MessageContext.Provider value={{
      messages,
      conversations,
      getUnreadCount,
      markAsRead,
      markConversationAsRead,
      startConversation,
      sendMessage,
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
import React, { createContext, useContext, useState } from 'react';
import { Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => Promise<boolean>;
  getNotificationsByUser: (userId: string) => Notification[];
  markAsRead: (notificationId: string) => Promise<boolean>;
  getUnreadCount: (userId: string) => number;
  removeNotification: (notificationId: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('kikoNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  const saveNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem('kikoNotifications', JSON.stringify(newNotifications));
  };

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<boolean> => {
    try {
      const newNotification: Notification = {
        ...notificationData,
        id: Math.random().toString(36).substring(2, 11),
        read: false,
        createdAt: new Date(),
      };

      saveNotifications([...notifications, newNotification]);
      return true;
    } catch (error) {
      console.error('Failed to add notification:', error);
      return false;
    }
  };

  const markAsRead = async (notificationId: string): Promise<boolean> => {
    try {
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );
      saveNotifications(updatedNotifications);
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  };

  const removeNotification = async (notificationId: string): Promise<boolean> => {
    try {
      const updatedNotifications = notifications.filter(
        notification => notification.id !== notificationId
      );
      saveNotifications(updatedNotifications);
      return true;
    } catch (error) {
      console.error('Failed to remove notification:', error);
      return false;
    }
  };

  const getNotificationsByUser = (userId: string) => {
    return notifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getUnreadCount = (userId: string) => {
    return notifications.filter(notification => 
      notification.userId === userId && !notification.read
    ).length;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      getNotificationsByUser,
      markAsRead,
      getUnreadCount,
      removeNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
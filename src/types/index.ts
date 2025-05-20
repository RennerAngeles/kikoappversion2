export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  location: string;
  contact: string;
  gender: string;
  age: number;
  profilePhoto?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Shop {
  id?: string;
  name: string;
  contact: string;
  location: string;
  isVerified: boolean;
  ownerId: string;
}

export type CategoryType = 'vegetable' | 'fruit' | 'seafood' | 'rice';

export interface Category {
  type: CategoryType;
  text: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  category: CategoryType;
  price: number;
  description: string;
  image: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'system';
  orderId?: string;
  read: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
  productId?: string;
}
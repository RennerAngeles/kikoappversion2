import React, { createContext, useContext, useState } from 'react';
import { Order } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => Promise<string>;
  getOrdersByBuyer: (buyerId: string) => Order[];
  getOrdersBySeller: (sellerId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<boolean>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kikoOrders');
    return saved ? JSON.parse(saved) : [];
  });

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('kikoOrders', JSON.stringify(newOrders));
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<string> => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substring(2, 11),
      status: 'pending',
      createdAt: new Date(),
    };

    saveOrders([...orders, newOrder]);
    return newOrder.id;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      saveOrders(updatedOrders);
      return true;
    } catch (error) {
      console.error('Failed to update order status:', error);
      return false;
    }
  };

  const getOrdersByBuyer = (buyerId: string) => {
    return orders.filter(order => order.buyerId === buyerId);
  };

  const getOrdersBySeller = (sellerId: string) => {
    return orders.filter(order => order.sellerId === sellerId);
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      getOrdersByBuyer,
      getOrdersBySeller,
      getOrderById,
      updateOrderStatus,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
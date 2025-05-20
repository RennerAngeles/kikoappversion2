import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface VerificationRequest {
  id: string;
  user: User;
  shop: {
    name: string;
    location: string;
    contact: string;
  };
  verificationFiles: {
    idPhoto: string;
    facePhoto: string;
  };
  status: 'pending' | 'approved' | 'declined';
  restricted?: boolean;
  restrictionReason?: string;
  createdAt: Date;
}

interface StoreContextType {
  verificationRequests: VerificationRequest[];
  submitVerification: (data: Omit<VerificationRequest, 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
  approveRequest: (id: string) => Promise<boolean>;
  declineRequest: (id: string) => Promise<boolean>;
  getVerificationStatus: (userId: string) => VerificationRequest | undefined;
  restrictSeller: (id: string, reason: string) => Promise<boolean>;
  unrestrictSeller: (id: string) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem('kikoVerificationRequests');
    return saved ? JSON.parse(saved) : [];
  });

  const saveRequests = (requests: VerificationRequest[]) => {
    setVerificationRequests(requests);
    localStorage.setItem('kikoVerificationRequests', JSON.stringify(requests));
  };

  const submitVerification = async (data: Omit<VerificationRequest, 'id' | 'status' | 'createdAt'>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newRequest: VerificationRequest = {
        ...data,
        id: Math.random().toString(36).substring(2, 11),
        status: 'pending',
        createdAt: new Date(),
      };

      saveRequests([...verificationRequests, newRequest]);
      return true;
    } catch (error) {
      console.error('Failed to submit verification:', error);
      return false;
    }
  };

  const approveRequest = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRequests = verificationRequests.map(request =>
        request.id === id ? { ...request, status: 'approved' } : request
      );
      
      saveRequests(updatedRequests);
      return true;
    } catch (error) {
      console.error('Failed to approve request:', error);
      return false;
    }
  };

  const declineRequest = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRequests = verificationRequests.map(request =>
        request.id === id ? { ...request, status: 'declined' } : request
      );
      
      saveRequests(updatedRequests);
      return true;
    } catch (error) {
      console.error('Failed to decline request:', error);
      return false;
    }
  };

  const restrictSeller = async (id: string, reason: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRequests = verificationRequests.map(request =>
        request.id === id ? { 
          ...request, 
          restricted: true,
          restrictionReason: reason
        } : request
      );
      
      saveRequests(updatedRequests);
      return true;
    } catch (error) {
      console.error('Failed to restrict seller:', error);
      return false;
    }
  };

  const unrestrictSeller = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRequests = verificationRequests.map(request =>
        request.id === id ? { 
          ...request, 
          restricted: false,
          restrictionReason: undefined
        } : request
      );
      
      saveRequests(updatedRequests);
      return true;
    } catch (error) {
      console.error('Failed to unrestrict seller:', error);
      return false;
    }
  };

  const getVerificationStatus = (userId: string) => {
    return verificationRequests.find(request => request.user.id === userId);
  };

  return (
    <StoreContext.Provider value={{
      verificationRequests,
      submitVerification,
      approveRequest,
      declineRequest,
      getVerificationStatus,
      restrictSeller,
      unrestrictSeller,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
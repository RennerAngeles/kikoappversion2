import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  getRegisteredUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for saved auth state in localStorage
    const savedUser = localStorage.getItem('kikoUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setAuthState({
          user: parsedUser,
          isAuthenticated: true
        });
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('kikoUser');
      }
    }

    // Initialize admin account if it doesn't exist
    const registeredUsers = getRegisteredUsers();
    if (!registeredUsers.find(user => user.email === 'admin@gmail.com')) {
      const adminUser: User = {
        id: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@gmail.com',
        password: 'admin123',
        location: 'System',
        contact: 'N/A',
        gender: 'Other',
        age: 0,
      };
      saveRegisteredUsers([...registeredUsers, adminUser]);
    }

    // Initialize Renner's account if it doesn't exist
    if (!registeredUsers.find(user => user.email === 'ren@gmail.com')) {
      const rennerUser: User = {
        id: 'renner',
        firstName: 'Renner',
        lastName: 'Angeles',
        email: 'ren@gmail.com',
        password: '@hakdog123',
        location: 'Manila',
        contact: '09123456789',
        gender: 'Male',
        age: 21,
      };
      saveRegisteredUsers([...registeredUsers, rennerUser]);
    }
  }, []);

  // Load registered users from localStorage
  const getRegisteredUsers = (): User[] => {
    const savedUsers = localStorage.getItem('kikoRegisteredUsers');
    return savedUsers ? JSON.parse(savedUsers) : [];
  };

  // Save registered users to localStorage
  const saveRegisteredUsers = (users: User[]) => {
    localStorage.setItem('kikoRegisteredUsers', JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check registered users
      const registeredUsers = getRegisteredUsers();
      const user = registeredUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        return false;
      }
      
      setAuthState({
        user,
        isAuthenticated: true
      });
      
      localStorage.setItem('kikoUser', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const registeredUsers = getRegisteredUsers();
      
      // Check if email already exists
      if (registeredUsers.some(user => user.email.toLowerCase() === userData.email.toLowerCase())) {
        return false;
      }

      // Create new user
      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substring(2, 11),
      };
      
      // Save to registered users
      saveRegisteredUsers([...registeredUsers, newUser]);
      
      // Log in the new user
      setAuthState({
        user: newUser,
        isAuthenticated: true
      });
      
      localStorage.setItem('kikoUser', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
    localStorage.removeItem('kikoUser');
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!authState.user) {
        return false;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser: User = {
        ...authState.user,
        ...userData
      };
      
      // Update in registered users
      const registeredUsers = getRegisteredUsers();
      const updatedUsers = registeredUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      );
      saveRegisteredUsers(updatedUsers);
      
      setAuthState({
        ...authState,
        user: updatedUser
      });
      
      localStorage.setItem('kikoUser', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      signup, 
      logout, 
      updateProfile,
      getRegisteredUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
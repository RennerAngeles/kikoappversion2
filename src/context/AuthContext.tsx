import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, handleSupabaseError } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{ user: User | null; isAuthenticated: boolean }>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) throw userError;

          if (userData) {
            setAuthState({
              user: {
                id: userData.id,
                email: userData.email,
                firstName: userData.first_name,
                lastName: userData.last_name,
                location: userData.location,
                contact: userData.contact,
                gender: userData.gender,
                age: userData.age,
                profilePhoto: userData.profile_photo,
              },
              isAuthenticated: true,
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authUser) return false;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError) throw userError;
      if (!userData) return false;

      setAuthState({
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          location: userData.location,
          contact: userData.contact,
          gender: userData.gender,
          age: userData.age,
          profilePhoto: userData.profile_photo,
        },
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  };

  const signup = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    try {
      // Create auth user
      const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password!,
      });

      if (authError) throw authError;
      if (!authUser) return false;

      // Create user profile
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          id: authUser.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          location: userData.location,
          contact: userData.contact,
          gender: userData.gender,
          age: userData.age,
          profile_photo: userData.profilePhoto,
        }])
        .select()
        .single();

      if (userError) throw userError;
      if (!newUser) return false;

      setAuthState({
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          location: newUser.location,
          contact: newUser.contact,
          gender: newUser.gender,
          age: newUser.age,
          profilePhoto: newUser.profile_photo,
        },
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setAuthState({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      handleSupabaseError(error);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!authState.user?.id) return false;

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          location: userData.location,
          contact: userData.contact,
          gender: userData.gender,
          age: userData.age,
          profile_photo: userData.profilePhoto,
        })
        .eq('id', authState.user.id)
        .select()
        .single();

      if (error) throw error;
      if (!updatedUser) return false;

      setAuthState({
        user: {
          ...authState.user,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          location: updatedUser.location,
          contact: updatedUser.contact,
          gender: updatedUser.gender,
          age: updatedUser.age,
          profilePhoto: updatedUser.profile_photo,
        },
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      handleSupabaseError(error);
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
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  welcomeImage: string;
  updateWelcomeImage: (image: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_WELCOME_IMAGE = 'https://images.pexels.com/photos/1660030/pexels-photo-1660030.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [welcomeImage, setWelcomeImage] = useState<string>(() => {
    const saved = localStorage.getItem('kikoWelcomeImage');
    return saved || DEFAULT_WELCOME_IMAGE;
  });

  const updateWelcomeImage = async (image: string): Promise<boolean> => {
    try {
      setWelcomeImage(image);
      localStorage.setItem('kikoWelcomeImage', image);
      return true;
    } catch (error) {
      console.error('Failed to update welcome image:', error);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      welcomeImage,
      updateWelcomeImage,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
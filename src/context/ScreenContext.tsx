import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ScreenContextType {
  isScreenOn: boolean;
  setIsScreenOn: React.Dispatch<React.SetStateAction<boolean>>;
  toggleScreen: () => void;
  registerOnScreenOff: (callback: () => void) => void;
  unregisterOnScreenOff: () => void;
}

// Create context with a default value
const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

// Custom hook to use the screen context
export const useScreen = (): ScreenContextType => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreen must be used within a ScreenProvider');
  }
  return context;
};

interface ScreenProviderProps {
  children: ReactNode;
}

// Provider component
export const ScreenProvider: React.FC<ScreenProviderProps> = ({ children }) => {
  const [isScreenOn, setIsScreenOn] = useState(false);
  const [onScreenOffCallback, setOnScreenOffCallback] = useState<(() => void) | null>(null);

  const registerOnScreenOff = useCallback((callback: () => void) => {
    setOnScreenOffCallback(() => callback);
  }, []);

  const unregisterOnScreenOff = useCallback(() => {
    setOnScreenOffCallback(null);
  }, []);

  const toggleScreen = useCallback(() => {
    const newScreenState = !isScreenOn;
    setIsScreenOn(newScreenState);
    
    // If turning screen off and we have a callback, execute it
    if (!newScreenState && onScreenOffCallback) {
      onScreenOffCallback();
    }
  }, [isScreenOn, onScreenOffCallback]);

  const value = {
    isScreenOn,
    setIsScreenOn,
    toggleScreen,
    registerOnScreenOff,
    unregisterOnScreenOff
  };

  return (
    <ScreenContext.Provider value={value}>
      {children}
    </ScreenContext.Provider>
  );
};

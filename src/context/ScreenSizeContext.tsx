import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ScreenSizeContextType {
  isSmall: boolean;
}

// Create context with a default value
const ScreenSizeContext = createContext<ScreenSizeContextType>({ isSmall: false });

// Custom hook to use the screen size context
export const useScreenSize = (): ScreenSizeContextType => {
  return useContext(ScreenSizeContext);
};

interface ScreenSizeProviderProps {
  children: ReactNode;
}

// Provider component
export const ScreenSizeProvider: React.FC<ScreenSizeProviderProps> = ({ children }) => {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    // Check initial screen size
    const checkScreenSize = () => {
      setIsSmall(window.innerWidth < 800);
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Clean up
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <ScreenSizeContext.Provider value={{ isSmall }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

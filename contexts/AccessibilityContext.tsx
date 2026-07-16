import React, { createContext, useState, useContext } from 'react';

// Contexto global para gerenciar se a tradução em Libras está ativa
export const AccessibilityContext = createContext({ 
  isLibrasActive: false, 
  toggleLibras: () => {},
  isHighContrast: false,
  toggleHighContrast: () => {}
});

export const AccessibilityProvider = ({ children }) => {
  const [isLibrasActive, setIsLibrasActive] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const toggleLibras = () => {
    setIsLibrasActive(prev => !prev);
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  return (
    <AccessibilityContext.Provider value={{ isLibrasActive, toggleLibras, isHighContrast, toggleHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);

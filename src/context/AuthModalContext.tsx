'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthModalContextType {
  isAuthModalOpen: boolean;
  openAuthModal: (redirectUrl?: string) => void;
  closeAuthModal: () => void;
  redirectUrl: string | null;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const openAuthModal = (redirectUrl?: string) => {
    setRedirectUrl(redirectUrl || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setRedirectUrl(null);
  };

  return (
    <AuthModalContext.Provider value={{ isAuthModalOpen, openAuthModal, closeAuthModal, redirectUrl }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
};

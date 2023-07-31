import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center h-full">
      {children}
    </div> 
  );
};

export default AuthLayout;
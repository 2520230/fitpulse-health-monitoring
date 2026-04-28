import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Navbar />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

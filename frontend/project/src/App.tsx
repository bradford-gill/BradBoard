import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { TicketsPage } from './pages/TicketsPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <LoginPage />
      </Layout>
    );
  }

  return (
    <Layout>
      <DataProvider>
        <TicketsPage />
      </DataProvider>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AppRoutes } from './routes/AppRoutes';
import { Watermark } from './components/common/Watermark';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Watermark />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from '@/context/ToastProvider';
import './index.css';
import App from './App';
import { AppWithErrorBoundary } from '@/error-handling/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <AppWithErrorBoundary>
        <App />
      </AppWithErrorBoundary>
    </ToastProvider>
  </StrictMode>,
)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from '@/context/ToastProvider';
import './index.css';
import App from './App';
import { AppWithErrorBoundary } from '@/error-handling/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <AppWithErrorBoundary>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AppWithErrorBoundary>
    </ToastProvider>
  </StrictMode>,
)

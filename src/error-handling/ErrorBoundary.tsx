import React, { Component, ReactNode } from 'react';
import { useToast } from '@/context/ToastProvider';
import { toast } from 'react-hot-toast'

interface ErrorBoundaryProps {
  children: ReactNode;
  toast: typeof toast;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error', error, errorInfo);
    this.props.toast.error('An unexpected error occurred! 🔥 Refresh the page to continue.', {
      style: {
        backgroundColor: 'red',
        color: 'white',
        fontWeight: 'bold',
      },
      icon: '🔥',
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#000',
            color: '#fff',
          }}
        >
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>💥 Oops! Something went wrong 💥</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
            Try refreshing the page or coming back later.
          </p>
          <button
            style={{
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AppWithErrorBoundary = ({ children }: { children: ReactNode }) => {
  const toast = useToast();
  return (
    <ErrorBoundary toast={toast}>
      {children}
    </ErrorBoundary>
  );
};
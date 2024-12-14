import { createContext, ReactNode, useContext } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ToastContext = createContext<typeof toast | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#333', color: '#fff' },
        }}
      />
    </ToastContext.Provider>
  );
};
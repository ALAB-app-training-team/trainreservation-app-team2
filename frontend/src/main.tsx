import '@/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import App from '@/App.tsx';

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <Toaster
                position="top-center"
                toastOptions={{
                    classNames: {
                        toast: '!w-96 !p-5',
                        title: '!text-base',
                        success:
                            '!bg-primary-light !border-l-4 !border-l-primary',
                        warning:
                            '!bg-orange-100 !border-l-4 !border-l-orange-400',
                        error:
                            '!bg-red-100 !border-l-4 !border-l-red-400',
                    },
                }}
            />
        </QueryClientProvider>
    </StrictMode>,
);

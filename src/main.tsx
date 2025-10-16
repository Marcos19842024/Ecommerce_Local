import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { runtimeConfig } from './services/config';
import './index.css';

const queryClient = new QueryClient();

// Inicializar configuración antes de renderizar
runtimeConfig.loadConfig().then(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<Toaster />
			</QueryClientProvider>
		</StrictMode>
	);
}).catch(console.error);
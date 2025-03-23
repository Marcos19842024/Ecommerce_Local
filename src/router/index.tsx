import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { HomePage, ProductsPage, ProductPage, AboutPage } from '../pages';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: 'productos',
				element: <ProductsPage />,
			},
			{
				path: 'productos/:name',
				element: <ProductPage />,
			},
			{
				path: 'nosotros',
				element: <AboutPage />,
			},
		],
	},
]);
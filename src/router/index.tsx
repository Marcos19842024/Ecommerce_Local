import { createBrowserRouter } from 'react-router-dom';
import { RemindersPage } from '../Pages/RemindersPage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <RemindersPage />
	}
]);
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../Pages/DashboardLayout';
import { RemindersPage } from '../Pages/RemindersPage';
import { TransportPage } from '../Pages/TransportPage';
import { ExpenseReportPage } from '../Pages/ExpenseReportPage';
import { CheckListPage } from '../Pages/CheckListPage';
import { OrgChartInteractivePage } from '../Pages/OrgChartInteractivePage';
import { DebtorsPage } from '../Pages/DebtorsPage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <DashboardLayout />,
		children: [
			{
				index: true,
				element: <Navigate to='/mensajes' />,
			},
			{
				path: 'mensajes',
				element: <RemindersPage />,
			},
			{
				path: 'transportes',
				element: <TransportPage />,
			},
			{
				path: 'reporte',
				element: <ExpenseReportPage />,
			},
			{
				path: 'checklist',
				element: <CheckListPage />,
			},
			{
				path: 'expedientes',
				element: <OrgChartInteractivePage />,
			},
			{
				path: 'Deudores',
				element: <DebtorsPage />,
			},
		],
	}
]);
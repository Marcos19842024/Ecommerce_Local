// router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../Pages/DashboardLayout';
import { RemindersPage } from '../Pages/RemindersPage';
import { TransportPage } from '../Pages/TransportPage';
import { ExpenseReportPage } from '../Pages/ExpenseReportPage';
import { CheckListPage } from '../Pages/CheckListPage';
import { OrgChartInteractivePage } from '../Pages/OrgChartInteractivePage';
import { DebtorsPage } from '../Pages/DebtorsPage';
import { AdminLogin } from '../Pages/AdminLogin';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { GeneralReportPage } from '../Pages/GeneralReportPage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <DashboardLayout />,
		children: [
		{
			index: true,
			element: <Navigate to='/checklist' />,
		},
		{
			path: 'mensajes',
			element: (
				<ProtectedRoute adminOnly>
					<RemindersPage />
				</ProtectedRoute>
			),
		},
		{
			path: 'transportes',
			element: (
				<ProtectedRoute adminOnly>
					<TransportPage />
				</ProtectedRoute>
			),
		},
		{
			path: 'reporte',
			element: (
				<ProtectedRoute adminOnly>
					<ExpenseReportPage />
				</ProtectedRoute>
			),
		},
		{
			path: 'checklist',
			element: <CheckListPage />,
		},
		{
			path: 'expedientes',
			element: (
				<ProtectedRoute adminOnly>
					<OrgChartInteractivePage />
				</ProtectedRoute>
			),
		},
		{
			path: 'deudores',
			element: (
				<ProtectedRoute adminOnly>
					<DebtorsPage />
				</ProtectedRoute>
			),
		},
		{
			path: 'reporte-general',
			element: (
				<ProtectedRoute adminOnly>
					<GeneralReportPage />
				</ProtectedRoute>
			),
		},
		{
			path: 'admin-login',
			element: <AdminLogin />,
		},
		],
	}
]);
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../Pages/DashboardLayout';
import { TransportPage } from '../Pages/TransportPage';
import { ExpenseReportPage } from '../Pages/ExpenseReportPage';
import { OrgChartInteractivePage } from '../Pages/OrgChartInteractivePage';
import { DebtorsPage } from '../Pages/DebtorsPage';
import { AdminLogin } from '../Pages/AdminLogin';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <DashboardLayout />,
		children: [
		{
			index: true,
			element: <Navigate to='/expedientes' />,
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
			path: 'admin-login',
			element: <AdminLogin />,
		},
		],
	}
]);
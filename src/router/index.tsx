import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RemindersPage } from '../Pages/RemindersPage';
import { TransportPage } from '../Pages/TransportPage';
import { ExpenseReportPage } from '../Pages/ExpenseReportPage';
import { ReadBillPage } from '../Pages/ReadBillPage';
import { DashboardLayout } from '../Pages/DashboardLayout';
import OrgChartInteractive from '../components/OrgChartInteractive';

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
				path: 'facturas',
				element: <ReadBillPage />,
			},
			{
				path: 'Expedientes',
				element: <OrgChartInteractive />,
			},
		],
	}
]);
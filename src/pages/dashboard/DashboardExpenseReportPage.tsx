import { ExpenseReport } from '../../components/dashboard';

export const DashboardExpenseReportPage = () => {
  return (
    <div className="flex flex-col flex-1 w-full min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Reporte de gastos</h1>

      <div className="flex-1 overflow-y-auto rounded-md bg-white p-4 shadow-md">
        <ExpenseReport />
      </div>
    </div>
  );
};
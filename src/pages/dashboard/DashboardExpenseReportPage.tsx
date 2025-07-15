import { ExpenseReport } from '../../components/dashboard';

export const DashboardExpenseReportPage = () => {
  return (
    <div className="flex flex-col h-full p-4">
      <h1 className='text-2xl font-bold'>Reporte de gastos</h1>
      <ExpenseReport/>
    </div>
  );
};
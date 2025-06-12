import { Reminders } from "../../components/dashboard";
import { Loader } from "../../components/shared/Loader";
import { useAllOrders } from "../../hooks";

export const DashboardRemindersPage = () => {
    const { data, isLoading } = useAllOrders();
    
    if (isLoading || !data) return <Loader />;

    return (
        <div className='space-y-5'>
            <h1 className='text-2xl font-bold'>Envío de mensajes</h1>
            <Reminders clientes={data} />
        </div>
    );
}
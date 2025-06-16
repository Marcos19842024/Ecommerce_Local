//import { Transport } from "../../components/dashboard";
import { Loader } from "../../components/shared/Loader";
import { useAllOrders } from "../../hooks";

export const DashboardTransportPage = () => {
    const { data, isLoading } = useAllOrders();
    
    if (isLoading || !data) return <Loader />;

    return (
        <div className='space-y-5'>
            <h1 className='text-2xl font-bold'>Lista de transportes</h1>
            {/* <Transport clientes={data} /> */}
        </div>
    );
}
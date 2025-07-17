import { IoAddCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { TableProduct } from '../../components/dashboard';

export const DashboardProductsPage = () => {
	return (
		<div className="h-full flex flex-col gap-2 p-2 sm:p-4">
			<div className="flex justify-end">
				<Link
					to="/dashboard/productos/new"
					className="bg-cyan-600 hover:bg-yellow-500 text-white flex items-center py-[6px] px-3 rounded-md gap-1 text-sm sm:text-base"
				>
					<IoAddCircleOutline className="inline-block text-lg sm:text-xl" />
						<span>Nuevo Producto</span>
				</Link>
			</div>

			<div className="w-full overflow-x-auto">
				<TableProduct />
			</div>
		</div>
	);
};
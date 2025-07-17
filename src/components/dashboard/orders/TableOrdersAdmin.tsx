import { useNavigate } from 'react-router-dom';
import { formatDateLong, formatPrice } from '../../../helpers';
import { OrderWithCustomer } from '../../../interfaces';
import { useChangeStatusOrder } from '../../../hooks';

const tableHeaders = ['Orden', 'Cliente', 'Fecha', 'Estado', 'Total'];

const statusOptions = [
	{ value: 'Pending', label: 'Pendiente' },
	{ value: 'Paid', label: 'Pagado' },
	{ value: 'Shipped', label: 'Enviado' },
	{ value: 'Delivered', label: 'Entregado' },
];

interface Props {
	orders: OrderWithCustomer[];
}

export const TableOrdersAdmin = ({ orders }: Props) => {
	const navigate = useNavigate();

	const { mutate } = useChangeStatusOrder();

	const handleStatusChange = (id: number, status: string) => {
		mutate({ id, status });
	};

	return (
		<div className="relative w-full h-full">
  			{/* Tabla en pantallas grandes */}
			<div className="hidden sm:block overflow-x-auto rounded-md border border-gray-200">
				<table className="text-sm w-full caption-bottom">
					<thead className="bg-gray-100 border-b border-gray-300">
						<tr className="text-sm font-bold text-left text-gray-700">
							{tableHeaders.map((header, index) => (
								<th key={index} className="h-12 px-4 whitespace-nowrap">
									{header}
								</th>
							))}
						</tr>
					</thead>

					<tbody className="[&_tr:last-child]:border-0">
						{orders.map(order => (
							<tr
								key={order.id}
								className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
								onClick={() => navigate(`/dashboard/ordenes/${order.id}`)}
							>
								<td className="p-4">{order.id}</td>
								<td className="p-4">
									<span className="block font-semibold">
										{order.customers?.full_name}
									</span>
									<span className="text-gray-500 text-xs">
										{order.customers?.email}
									</span>
								</td>
								<td className="p-4">{formatDateLong(order.created_at)}</td>
								<td className="p-4">
									<select
										value={order.status || ''}
										onClick={e => e.stopPropagation()}
										className="border border-gray-300 px-2 py-1 text-sm rounded w-full"
										onChange={e => handleStatusChange(order.id, e.target.value)}
									>
										{statusOptions.map(option => (
											<option value={option.value} key={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</td>
								<td className="p-4 font-medium">{formatPrice(order.total_amount)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

  			{/* Card layout para móviles */}
			<div className="block sm:hidden space-y-4">
				{orders.map(order => (
					<div
						key={order.id}
						className="border border-gray-200 rounded-md p-4 shadow-sm bg-white"
						onClick={() => navigate(`/dashboard/ordenes/${order.id}`)}
					>
						<div className="text-sm mb-2">
							<span className="text-gray-500 font-medium">ID Orden: </span>
							{order.id}
						</div>

						<div className="text-sm mb-2">
							<span className="text-gray-500 font-medium">Cliente: </span>
							<div className="flex flex-col">
								<span className="font-semibold">{order.customers?.full_name}</span>
								<span className="text-xs text-gray-600">{order.customers?.email}</span>
							</div>
						</div>

						<div className="text-sm mb-2">
							<span className="text-gray-500 font-medium">Fecha: </span>
							{formatDateLong(order.created_at)}
						</div>

						<div className="text-sm mb-2">
							<span className="text-gray-500 font-medium">Estado: </span>
							<select
								value={order.status || ''}
								onClick={e => e.stopPropagation()}
								className="border border-gray-300 mt-1 px-2 py-1 text-sm rounded w-full"
								onChange={e => handleStatusChange(order.id, e.target.value)}
							>
								{statusOptions.map(option => (
									<option value={option.value} key={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div className="text-sm">
							<span className="text-gray-500 font-medium">Total: </span>
							{formatPrice(order.total_amount)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
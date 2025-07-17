import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderAdmin } from '../../hooks';
import { Loader } from '../../components/shared/Loader';
import { formatDateLong, formatPrice } from '../../helpers';

const tableHeaders = ['Producto', 'Cantidad', 'Total'];

export const DashboardOrderPage = () => {
	const navigate = useNavigate();

	const { id } = useParams<{ id: string }>();

	const { data: order, isLoading } = useOrderAdmin(Number(id));

	if (isLoading || !order) return <Loader />;

	return (
		<div className="px-2 sm:px-4 lg:px-8">
  			{/* Encabezado */}
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
				<button
					className="border rounded-full py-2 border-slate-200 px-5 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest hover:bg-stone-100 transition-all"
					onClick={() => navigate(-1)}
				>
					<IoChevronBack size={16} />
					Volver
				</button>

				<div className="text-center sm:text-left">
					<h1 className="text-2xl sm:text-3xl font-bold">Pedido #{id}</h1>
					<p className="text-sm text-gray-500">{formatDateLong(order.created_at)}</p>
				</div>

				<div className="w-0 sm:w-16" /> {/* Espaciador opcional */}
			</div>

			{/* Detalle del pedido */}
			<div className="mt-10 mb-5 space-y-10">
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
						<tbody>
							{order.orderItems.map((item, index) => (
								<tr key={index} className="border-b border-gray-200">
									<td className="p-4 flex gap-4 items-center">
										<img
											src={item.productImage}
											alt={item.productName}
											className="h-20 w-20 object-contain rounded-lg"
										/>
										<div className="space-y-1">
											<h3 className="font-semibold">{item.productName}</h3>
											<p className="text-xs text-gray-600">
												{item.target} / {item.type} / {item.kg} kg
											</p>
											<p className="text-sm">{formatPrice(item.price)}</p>
										</div>
									</td>
									<td className="p-4 text-center">{item.quantity}</td>
									<td className="p-4 text-center">{formatPrice(item.price * item.quantity)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Cards para móvil */}
				<div className="block sm:hidden space-y-4">
					{order.orderItems.map((item, index) => (
						<div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
							<div className="flex gap-4 items-center">
								<img
									src={item.productImage}
									alt={item.productName}
									className="h-16 w-16 object-contain rounded-md"
								/>
								<div className="flex flex-col gap-1">
									<span className="font-semibold">{item.productName}</span>
									<span className="text-xs text-gray-500">
										{item.target} / {item.type} / {item.kg} kg
									</span>
									<span className="text-sm">{formatPrice(item.price)}</span>
								</div>
							</div>
							<div className="mt-2 flex justify-between text-sm">
								<span className="text-gray-600">Cantidad:</span>
								<span>{item.quantity}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Total:</span>
								<span>{formatPrice(item.price * item.quantity)}</span>
							</div>
						</div>
					))}
				</div>

				{/* Totales */}
				<div className="w-full sm:w-1/2 self-end ml-auto space-y-2 text-sm text-gray-700">
					<div className="flex justify-between">
						<span>Subtotal</span>
						<span>{formatPrice(order.totalAmount)}</span>
					</div>
					<div className="flex justify-between font-bold text-black">
						<span>Total</span>
						<span>{formatPrice(order.totalAmount)}</span>
					</div>
				</div>

				{/* Dirección */}
				<div className="space-y-3">
					<h2 className="text-lg font-bold">Dirección</h2>
					<div className="border border-stone-300 p-4 rounded-md bg-white space-y-4">
						<div>
							<h3 className="font-medium text-sm">Cliente:</h3>
							<p className="text-sm">{order.customer.full_name}</p>
						</div>

						<div>
							<h3 className="font-medium text-sm mb-1">Envío:</h3>
							<div className="text-sm text-gray-700 space-y-1">
								<p>{order.address.addressLine1}</p>
								{order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
								<p>{order.address.city}</p>
								<p>{order.address.state}</p>
								<p>{order.address.postalCode}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
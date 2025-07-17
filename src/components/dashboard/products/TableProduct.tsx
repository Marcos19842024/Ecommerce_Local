import { useState } from 'react';
import { FaEllipsis } from 'react-icons/fa6';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useDeleteProduct, useProducts } from '../../../hooks';
import { Loader } from '../../shared/Loader';
import { formatDate, formatPrice } from '../../../helpers';
import { Pagination } from '../../shared/Pagination';
import { CellTableProduct } from './CellTableProduct';

const tableHeaders = [
	'',
	'Nombre',
	'Variante',
	'Precio',
	'Stock',
	'Fecha de creación',
	'',
];

export const TableProduct = () => {
	const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(
		null
	);
	const [selectedVariants, setSelectedVariants] = useState<{
		[key: string]: number;
	}>({});
	const [page, setPage] = useState(1);

	const { products, isLoading, totalProducts } = useProducts({
		page,
	});
	const { mutate, isPending } = useDeleteProduct();

	const handleMenuToggle = (index: number) => {
		if (openMenuIndex === index) {
			setOpenMenuIndex(null);
		} else {
			setOpenMenuIndex(index);
		}
	};

	const handleVariantChange = (
		productId: string,
		variantIndex: number
	) => {
		setSelectedVariants({
			...selectedVariants,
			[productId]: variantIndex,
		});
	};

	const handleDeleteProduct = (id: string) => {
		mutate(id);
		setOpenMenuIndex(null);
	};

	if (!products || isLoading || !totalProducts || isPending)
		return <Loader />;

	return (
		<div className="flex flex-col flex-1 border border-gray-200 rounded-lg p-4 sm:p-5 bg-white">
  			<h1 className="font-bold text-lg sm:text-xl">Productos</h1>

			<p className="text-sm mt-1 mb-6 sm:mb-8 text-gray-500">
				Gestiona tus productos y mira las estadísticas de tus ventas
			</p>

  			{/* Tabla para pantallas grandes */}
			<div className="hidden sm:block overflow-x-auto rounded-md">
				<table className="min-w-[700px] w-full text-sm text-left caption-bottom">
					<thead className="border-b border-gray-200">
						<tr className="font-bold text-gray-700">
							{tableHeaders.map((header, index) => (
								<th key={index} className="h-12 px-4 whitespace-nowrap">
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{products.map((product, index) => {
							const selectedVariantIndex = selectedVariants[product.id] ?? 0;
							const selectedVariant = product.variants[selectedVariantIndex] || {};

							return (
								<tr key={index} className="border-b border-gray-100">
									<td className="p-4 align-middle">
										<img
											src={product.images[0] || 'https://ui.shadcn.com/placeholder.svg'}
											alt="Imagen Producto"
											className="w-16 h-16 aspect-square rounded-md object-contain"
										/>
									</td>
									<CellTableProduct content={product.name} />
									<td className="p-4">
										<select
											className="border border-gray-300 rounded-md p-1 w-full text-sm"
											onChange={(e) =>
												handleVariantChange(product.id, Number(e.target.value))
											}
											value={selectedVariantIndex}
										>
											{product.variants.map((variant, variantIndex) => (
												<option key={variant.id} value={variantIndex}>
													{variant.target} - {variant.type} - {variant.kg} kg.
												</option>
											))}
										</select>
									</td>
									<CellTableProduct content={formatPrice(selectedVariant?.price)} />
									<CellTableProduct content={(selectedVariant.stock || 0).toString()} />
									<CellTableProduct content={formatDate(product.created_at)} />
									<td className="relative">
										<button
											className="text-slate-900"
											onClick={() => handleMenuToggle(index)}
										>
											<FaEllipsis />
										</button>
										{openMenuIndex === index && (
											<div className="absolute right-12 top-2 mt-2 bg-white border border-gray-200 rounded-md shadow-xl z-10 w-[90px]">
												<Link
													to={`/dashboard/productos/editar/${product.slug}`}
													className="flex items-center gap-1 w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
												>
													Editar
													<HiOutlineExternalLink size={13} />
												</Link>
												<button
													className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
													onClick={() => handleDeleteProduct(product.id)}
												>
													Eliminar
												</button>
											</div>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Card layout para móviles */}
			<div className="block sm:hidden space-y-4">
				{products.map((product, index) => {
					const selectedVariantIndex = selectedVariants[product.id] ?? 0;
					const selectedVariant = product.variants[selectedVariantIndex] || {};

					return (
						<div
							key={index}
							className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2"
						>
							<div className="flex items-center gap-3">
								<img
									src={product.images[0] || 'https://ui.shadcn.com/placeholder.svg'}
									alt="Imagen Producto"
									className="w-16 h-16 rounded-md object-contain"
								/>
								<div className="font-semibold text-base">{product.name}</div>
							</div>

							<div>
								<label className="text-xs text-gray-500">Variante</label>
								<select
									className="border border-gray-300 rounded-md p-1 w-full text-sm mt-1"
									onChange={(e) =>
										handleVariantChange(product.id, Number(e.target.value))
									}
									value={selectedVariantIndex}
								>
									{product.variants.map((variant, variantIndex) => (
										<option key={variant.id} value={variantIndex}>
											{variant.target} - {variant.type} - {variant.kg} kg.
										</option>
									))}
								</select>
							</div>

							<div className="text-sm">
								<span className="text-gray-500">Precio: </span>
								{formatPrice(selectedVariant?.price)}
							</div>
							<div className="text-sm">
								<span className="text-gray-500">Stock: </span>
								{selectedVariant.stock || 0}
							</div>
							<div className="text-sm">
								<span className="text-gray-500">Fecha: </span>
								{formatDate(product.created_at)}
							</div>

							<div className="flex gap-2 justify-end">
								<Link
									to={`/dashboard/productos/editar/${product.slug}`}
									className="text-sm text-blue-600 hover:underline"
								>
									Editar
								</Link>
								<button
									className="text-sm text-red-600 hover:underline"
									onClick={() => handleDeleteProduct(product.id)}
									>
									Eliminar
								</button>
							</div>
						</div>
					);
				})}
			</div>

			{/* Paginación */}
			<div className="mt-4 sm:mt-6">
				<Pagination page={page} setPage={setPage} totalItems={totalProducts} />
			</div>
		</div>
	);
};
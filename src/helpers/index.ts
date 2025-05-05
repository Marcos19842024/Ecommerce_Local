import { Product, VariantProduct, Target } from '../interfaces';

// Función para formatear el precio a dólares
export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('es-ES', {
		style: 'currency',
		currency: 'MXN',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);
};

// Función para preparar los productos
export const prepareProducts = (products: Product[]) => {
	return products.map(product => {
		// Agrupar los variantes por target
		const targets = product.variants.reduce(
			(acc: Target[], variant: VariantProduct) => {
				const existingTarget = acc.find(
					item => item.target === variant.target
				);

				if (existingTarget) {
					// Si ya existe el target, comparamos los precios
					existingTarget.price = Math.min(
						existingTarget.price,
						variant.price
					);
				} // Mantenemos el precio mínimo
				else {
					acc.push({
						target: variant.target,
						type: variant.type,
						kg: variant.kg,
						price: variant.price
					});
				}
				
				return acc;
			},
			[]
		);

		// Obtener el precio más bajo de las variantes agrupadas
		const price = Math.min(...targets.map(item => item.price));

		// Devolver el producto formateado
		return {
			...product,
			price,
			targets: targets.map(({ target, type, kg }) => ({ target, type, kg })),
			variants: product.variants,
		};
	});
};

// Función para formatear la fecha a formato 3 de enero de 2022
export const formatDateLong = (date: string): string => {
	const dateObject = new Date(date);

	return dateObject.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

// Función para formatear la fecha a formato dd/mm/yyyy
export const formatDate = (date: string): string => {
	const dateObject = new Date(date);
	return dateObject.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: '2-digit',
		day: 'numeric',
	});
};

// Función para obtener el estado del pedido en español
export const getStatus = (status: string): string => {
	switch (status) {
		case 'Pending':
			return 'Pendiente';
		case 'Paid':
			return 'Pagado';
		case 'Shipped':
			return 'Enviado';
		case 'Delivered':
			return 'Entregado';
		default:
			return status;
	}
};

// Función para generar el slug de un producto
export const generateSlug = (name: string): string => {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
};

// Función para extraer el path relativo al bucket de una URL
export const extractFilePath = (url: string) => {
	const parts = url.split(
		'/storage/v1/object/public/product-images/'
	);
	// EJEMPLO PARTS: ['/storage/v1/ object/public/product-images/', '02930920302302030293023-Royal Canin.jpg']

	if (parts.length !== 2) {
		throw new Error(`URL de imagen no válida: ${url}`);
	}

	return parts[1];
};
import { Targets, Product, VariantProduct } from '../interfaces';

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
			(acc: Targets[], variant: VariantProduct) => {
				const existingTarget = acc.find(
					item => item.target === variant.target
				);

				if (existingTarget) {
					// Si ya existe el target, comparamos las precios
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
						price: variant.price,
					});
				}

				return acc;
			},
			[]
		);

		// Obtener el precio más bajo de las variantes agrupadas
		const price = Math.min(...targets.map(item => item.price));

		// Devolver el target formateado
		return {
			...product,
			price,
			targets: targets.map(({target, type, kg}) => ({target, type, kg})),
			variants: product.variants,
		};
	});
};
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

				// Si ya existe el target, comparamos los precios
				if (existingTarget) {
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
				};
				
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
			targets: targets.map(({ target, type, kg, price }) => ({ target, type, kg, price })),
			variants: product.variants,
		};
	});
};
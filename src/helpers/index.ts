import { Product, VariantProduct, Target, Type, Kg } from '../interfaces';

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

				if (!existingTarget) {
					// Si no existe el target, lo añadimos
					// Agrupar las variantes por type
					const types = product.variants.reduce(
						(acc: Type[], variant: VariantProduct) => {
							const existingType = acc.find(
								item => item.type === variant.type
							);

							if (!existingType) {
								// Si no existe el tipo, lo añadimos
								// Agrupar las variantes por kg
								const kgs = product.variants.reduce(
									(acc: Kg[], variant: VariantProduct) => {
										const existingKg = acc.find(
											item => item.kg === variant.kg
										);
						
										if (existingKg) {
											// Si ya existe el peso, comparamos los precios
											existingKg.price = Math.min(
												existingKg.price,
												variant.price
											);
										} // Mantenemos el precio mínimo
										else {
											acc.push({
												kg: variant.kg,
												price: variant.price,
											});
										};
						
										return acc;
									},
									[]
								);

								acc.push({
									type: variant.type,
									kgs: kgs,
								});
							};

							return acc;
						},
						[]
					);

					acc.push({
						target: variant.target,
						types: types,
					});
				};
				
				return acc;
			},
			[]
		);

		// Devolver el producto formateado
		return {
			...product,
			targets: targets.map(({ target,types }) => ({ target, types })),
			variants: product.variants,
		};
	});
};
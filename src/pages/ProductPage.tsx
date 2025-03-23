import { LuMinus, LuPlus } from 'react-icons/lu';
import { Separator } from '../components/shared/Separator';
import { formatPrice } from '../helpers';
import { CiDeliveryTruck } from 'react-icons/ci';
import { Link, useParams } from 'react-router-dom';
import { ProductDescription } from '../components/one-product/ProductDescription';
import { GridImages } from '../components/one-product/GridImages';
import { useProduct } from '../hooks/products/useProduct';
import { useEffect, useMemo, useState } from 'react';
import { VariantProduct } from '../interfaces';
import { Tag } from '../components/shared/Tag';
import { Loader } from '../components/shared/Loader';

interface Acc {
	[key: string]: {
		peso: number;
        types: string[];
	};
}

export const ProductPage = () => {
	const { name } = useParams<{ name: string }>();

	const { product, isLoading, isError } = useProduct(name || '');

	const [selectedTarget, setSelectedTarget] = useState<string | null>(
		null
	);

	const [selectedType, setSelectedType] = useState<
		string | null
	>(null);

	const [selectedVariant, setSelectedVariant] =
		useState<VariantProduct | null>(null);

	// Agrupamos las variantes por target
	const targets = useMemo(() => {
		return (
			product?.variants.reduce(
				(acc: Acc, variant: VariantProduct) => {
					const { target, type, kg } = variant;
					if (!acc[target]) {
						acc[target] = {
                            peso: kg,
                            types: [],
						};
					}

					if (!acc[target].types.includes(type)) {
						acc[target].types.push(type);
					}

					return acc;
				},
				{} as Acc
			) || {}
		);
	}, [product?.variants]);

	// Obtener el primer target predeterminado si no se ha seleccionado ninguno
	const availableTargets = Object.keys(targets);
	useEffect(() => {
		if (!selectedTarget && availableTargets.length > 0) {
			setSelectedTarget(availableTargets[0]);
		}
	}, [availableTargets, selectedTarget]);

	// Actualizar el tipo seleccionado cuando cambia el target
	useEffect(() => {
		if (selectedTarget && targets[selectedTarget] && !selectedType) {
			setSelectedType(targets[selectedTarget].types[0]);
		}
	}, [selectedTarget, targets, selectedType]);

	// Obtener la variante seleccionada
	useEffect(() => {
		if (selectedTarget && selectedType) {
			const variant = product?.variants.find(
                (variant: { target: string; type: string; }) =>
					variant.target === selectedTarget &&
					variant.type === selectedType
			);

			setSelectedVariant(variant as VariantProduct);
		}
	}, [selectedTarget, selectedType, product?.variants]);

	// Obtener el stock
	const isOutOfStock = selectedVariant?.stock === 0;

	if (isLoading) return <Loader />;

	if (!product || isError)
		return (
			<div className='flex justify-center items-center h-[80vh]'>
				<p>Producto no encontrado</p>
			</div>
		);

	return (
		<>
			<div className='h-fit flex flex-col md:flex-row gap-16 mt-8'>
				{/* GALERÍA DE IMAGENES */}
				<GridImages images={product.images} />

				<div className='flex-1 space-y-5'>
					<h1 className='text-3xl font-bold tracking-tight'>
						{product.name}
					</h1>

					<div className='flex gap-5 items-center'>
						<span className='tracking-wide text-lg font-semibold'>
							{formatPrice(
								selectedVariant?.price || product.variants[0].price
							)}
						</span>

						<div className='relative'>
							{isOutOfStock && <Tag contentTag='agotado' />}
						</div>
					</div>

					<Separator />

					{/* Características */}
					{/* <ul className='space-y-2 ml-7 my-10'>
						{product.features.map(feature => (
							<li
								key={feature}
								className='text-sm flex items-center gap-2 tracking-tight font-medium'
							>
								<span className='bg-black w-[5px] h-[5px] rounded-full' />
								{feature}
							</li>
						))}
					</ul> */}

					<div className='flex flex-col gap-3'>
						<p>
                            Especie: {selectedTarget && targets[selectedTarget].types}
						</p>
						<div className='flex gap-3'>
							{availableTargets.map(target => (
								<button
									key={target}
									className={`w-8 h-8 flex justify-center items-center ${
										selectedTarget === target
											? 'border border-slate-800'
											: ''
									}`}
									onClick={() => setSelectedTarget(target)}>{target}
								</button>
							))}
						</div>
					</div>

					{/* OPCIONES DE TIPO */}
					<div className='flex flex-col gap-3'>
						<p className='text-xs font-medium'>
							Tipos disponible
						</p>

						{selectedTarget && (
							<div className='flex gap-3'>
								<select
									className='border border-gray-300 px-3 py-1'
									value={selectedType || ''}
									onChange={e => setSelectedType(e.target.value)}
								>
									{targets[selectedTarget].types.map((type: string) => (
										<option value={type} key={type}>
											{type}
										</option>
									))}
								</select>
							</div>
						)}
					</div>

					{/* COMPRAR */}
					{isOutOfStock ? (
						<button
							className='bg-[#f3f3f3] uppercase font-semibold tracking-widest text-xs py-4 rounded-full transition-all duration-300 hover:bg-[#e2e2e2] w-full'
							disabled
						>
							Agotado
						</button>
					) : (
						<>
							{/* Contador */}
							<div className='space-y-3'>
								<p className='text-sm font-medium'>Cantidad:</p>

								<div className='flex gap-8 px-5 py-3 border border-slate-200 w-fit rounded-full'>
									<button>
										<LuMinus size={15} />
									</button>
									<span className='text-slate-500 text-sm'>1</span>
									<button>
										<LuPlus size={15} />
									</button>
								</div>
							</div>

							{/* BOTONES ACCIÓN */}
							<div className='flex flex-col gap-3'>
								<button className='bg-[#f3f3f3] uppercase font-semibold tracking-widest text-xs py-4 rounded-full transition-all duration-300 hover:bg-[#e2e2e2]'>
									Agregar al carro
								</button>
								<button className='bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 rounded-full'>
									Comprar ahora
								</button>
							</div>
						</>
					)}

					<div className='flex pt-2'>
						<div className='flex flex-col gap-1 flex-1 items-center'>
							<CiDeliveryTruck size={35} />
						</div>

						<Link
							to='#'
							className='flex flex-col gap-1 flex-1 items-center justify-center'>
						</Link>
					</div>
				</div>
			</div>

			{/* DESCRIPCIÓN */}
			<ProductDescription content={product.description} />
		</>
	);
};
import { LuMinus, LuPlus } from 'react-icons/lu';
import { Separator } from '../components/shared/Separator';
import { formatPrice } from '../helpers';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BsChatLeftText } from 'react-icons/bs';
import { ProductDescription } from '../components/one-product/ProductDescription';
import { GridImages } from '../components/one-product/GridImages';
import { useProduct } from '../hooks/products/useProduct';
import { useEffect, useMemo, useState } from 'react';
import { VariantProduct } from '../interfaces';
import { Tag } from '../components/shared/Tag';
import { Loader } from '../components/shared/Loader';
import { useCounterStore } from '../store/counter.store';
import { useCartStore } from '../store/cart.store';
import toast from 'react-hot-toast';

interface Ta {
	[key: string]: {
		types: string[];
	};
};

interface Ty {
	[key: string]: {
		kgs: number[];
	};
};

export const ProductPage = () => {
	const { slug } = useParams<{ slug: string }>();

	const [currentSlug, setCurrentSlug] = useState(slug);

	const { product, isLoading, isError } = useProduct(
		currentSlug || ''
	);

	const [selectedTarget, setSelectedTarget] = useState<string | null>(
		null
	);

	const [selectedType, setSelectedType] = useState<string | null>(
		null
	);

	const [selectedKg, setSelectedKg] = useState<number | null>(
		null
	);

	const [selectedVariant, setSelectedVariant] = useState<VariantProduct | null>(null);

	const count = useCounterStore(state => state.count);

	const increment = useCounterStore(state => state.increment);
	
	const decrement = useCounterStore(state => state.decrement);

	const addItem = useCartStore(state => state.addItem);

	const navigate = useNavigate();

	// Agrupamos las variantes por target
	const targets = useMemo(() => {
		return (
			product?.variants.reduce(
				(acc: Ta, variant: VariantProduct) => {
					const { target, type } = variant;
					if (!acc[target]) {
						acc[target] = {
							types: [],
						};
					}

					if (!acc[target].types.includes(type)) {
						acc[target].types.push(type);
					}

					return acc;
				},
				{} as Ta
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

	// Obtener el primer tipo predeterminado si no se ha seleccionado ninguno
	const availableTypes = Object.keys(types);
	useEffect(() => {
		if (!selectedType && availableTypes.length > 0) {
			setSelectedType(availableTypes[0]);
		}
	}, [availableTypes, selectedType]);

	// Actualizar el tipo seleccionado cuando cambia el target
	useEffect(() => {
		if (selectedTarget && targets[selectedTarget] && !selectedType) {
			setSelectedType(targets[selectedTarget].types[0]);
			setSelectedKg(targets[selectedTarget].types[0].kgs[0]);
		}
	}, [selectedTarget, targets, selectedType]);

	// Obtener la variante seleccionada
	useEffect(() => {
		if (selectedTarget && selectedType && selectedKg) {
			const variant = product?.variants.find(
                (variant: { target: string; type: string; kg: number }) =>
					variant.target === selectedTarget &&
					variant.type === selectedType &&
					variant.kg === selectedKg
			);

			setSelectedVariant(variant as VariantProduct);
		}
	}, [selectedTarget, selectedType, selectedKg, product?.variants ]);

	// Obtener el stock
	const isOutOfStock = selectedVariant?.stock === 0;

	// Función para añadir al carrito
	const addToCart = () => {
		if (selectedVariant) {
			addItem({
				variantId: selectedVariant.id,
				productId: product?.id || '',
				name: product?.name || '',
				image: product?.images[0] || '',
				target: selectedVariant.target,
				type: selectedVariant.type,
				kg: selectedVariant.kg,
				price: selectedVariant.price,
				quantity: count,
			});
			toast.success('Producto añadido al carrito', {
				position: 'bottom-right',
			});
		}
	};

	// Función para comprar ahora
	const buyNow = () => {
		if (selectedVariant) {
			addItem({
				variantId: selectedVariant.id,
				productId: product?.id || '',
				name: product?.name || '',
				image: product?.images[0] || '',
				target: selectedVariant.target,
				type: selectedVariant.type,
				kg: selectedVariant.kg,
				price: selectedVariant.price,
				quantity: count,
			});

			navigate('/checkout');
		}
	};

	// Resetear el name actual cuando cambia en la URL
	useEffect(() => {
		setCurrentSlug(slug);

		// Reiniciar target, type y variante seleccionada
		setSelectedTarget(null);
		setSelectedType(null);
		setSelectedKg(null);
		setSelectedVariant(null);
	}, [slug]);

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
				<GridImages images={[product.images[0]]} />

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

					{/* OPCIONES DE OBJETIVO */}
					<div className='flex flex-col gap-3'>
						<p className='text-xs font-medium'>
							Objetivos disponibles
						</p>

						{availableTargets && (
							<div className='flex gap-3'>
								<select
									className='border border-gray-300 px-3 py-1'
									value={selectedTarget || ''}
									onChange={e => setSelectedTarget(e.target.value)}
								>
									{availableTargets.map(target => (
										<option value={target} key={target}>
											{target}
										</option>
									))}
								</select>
							</div>
						)}
					</div>

					{/* OPCIONES DE TIPO */}
					<div className='flex flex-col gap-3'>
						<p className='text-xs font-medium'>
							Tipos disponibles
						</p>

						{selectedTarget && (
							<div className='flex gap-3'>
								<select
									className='border border-gray-300 px-3 py-1'
									value={selectedType || ''}
									onChange={e => setSelectedType(e.target.value)}
								>
									{targets[selectedTarget].types.map(type => (
										<option value={type} key={type}>
											{type}
										</option>
									))}
								</select>
							</div>
						)}
					</div>

					{/* OPCIONES DE PESO */}
					<div className='flex flex-col gap-3'>
						<p className='text-xs font-medium'>
							Pesos disponibles
						</p>

						{selectedTarget && selectedType && (
							<div className='flex gap-3'>
								<select
									className='border border-gray-300 px-3 py-1'
									value={selectedKg || ''}
									onChange={e => setSelectedType(e.target.value)}
								>
									{targets[selectedTarget].kgs.map(kg => (
										<option value={kg} key={kg}>
											{kg}
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
									<button
										onClick={decrement}
										disabled={count === 1}>
										<LuMinus size={15} />
									</button>
									<span className='text-slate-500 text-sm'>{count}</span>
									<button
										onClick={increment}>
										<LuPlus size={15} />
									</button>
								</div>
							</div>

							{/* BOTONES ACCIÓN */}
							<div className='flex flex-col gap-3'>
								<button
									className='bg-[#f3f3f3] uppercase font-semibold tracking-widest text-xs py-4 rounded-full transition-all duration-300 hover:bg-[#e2e2e2]'
									onClick={addToCart}>Agregar al carro
								</button>
								<button
									className='bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 rounded-full'
									onClick={buyNow}>Comprar ahora
								</button>
							</div>
						</>
					)}

					<div className='flex pt-2'>
						<Link
							to='#'
							className='flex flex-col gap-1 flex-1 items-center justify-center'>
								<BsChatLeftText size={30} />
								<p className='flex flex-col items-center text-xs'>
								<span className='font-semibold'>
									¿Necesitas ayuda?
								</span>
								Contáctanos aquí
							</p>
						</Link>
					</div>
				</div>
			</div>

			{/* DESCRIPCIÓN */}
			<ProductDescription content={product.description} />
		</>
	);
};
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { VariantProduct } from '../../interfaces';
import { formatPrice } from '../../helpers';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCartStore } from '../../store/cart.store';
import React from 'react';

interface Props {
	img: string;
	name: string;
	price: number;
	targets: { target: string, type: string, kg: number, price: number }[];
	variants: VariantProduct[];
}

export const CardProduct = ({
	img,
	name,
	price,
	targets,
	variants,
}: Props) => {
	const [activeTarget, setActiveTarget] = useState<{
		target: string;
		type : string;
		kg: number
	}>(targets[0]);

	const addItem = useCartStore(state => state.addItem);

	const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (selectedVariant && selectedVariant.stock > 0) {
			addItem({
				variantId: selectedVariant?.id || "0",
				productId: name,
				name,
				image: img,
				target: activeTarget.target,
				type: selectedVariant?.type || "",
				kg: selectedVariant?.kg || 0,
				price: selectedVariant?.price || 0,
				quantity: 1,
			});
			toast.success('Producto añadido al carrito', {
				position: 'bottom-right',
			});
		} else {
			toast.error('Producto agotado', {
				position: 'bottom-right',
			});
		}
	};

	// Identificar la variante seleccionada según el target activo
	const selectedVariant  = variants.find(
		variant => variant.target === activeTarget.target && variant.type === activeTarget.type && variant.kg === activeTarget.kg
	);

	const stock = selectedVariant?.stock || 0;

	return (
		<div className='flex flex-col gap-6 relative'>
			<Link
				to={`/productos/${name}`}
				className='flex relative group overflow-hidden '
			>
				<div className='flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]'>
					<img
						src={img}
						alt={name}
						className='object-contain h-full w-full'
					/>
				</div>

				<button
					className='bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'
					onClick={handleAddClick}>
					<FiPlus />
					Añadir
				</button>
			</Link>

			<div className='flex flex-col gap-1 items-center'>
				<p className='text-[15px] font-medium'>{name}</p>
				<p className='text-[15px] font-medium'>{formatPrice(price)}</p>

				<div className='flex gap-3'>
					{targets.map(target => (
						<span
							key={target.target}
							className={`grid place-items-center w-20 h-10 cursor-pointer ${
								activeTarget === target
								? 'border border-black'
								: ''
							}`}	
							onClick={() => setActiveTarget(target)}>
						</span>
					))}
				</div>

				<div className='flex gap-3'>
					{targets.map(target => (
						<span
							key={target.type}
							className={`grid place-items-center w-20 h-10 cursor-pointer ${
								activeTarget.type === target.type
								? 'border border-black'
								: ''
							}`}	
							onClick={() => setActiveTarget(target)}>
						</span>
					))}
				</div>

				<div className='flex gap-3'>
					{targets.map(target => (
						<span
							key={target.kg}
							className={`grid place-items-center w-20 h-10 cursor-pointer ${
								activeTarget.kg === target.kg
								? 'border border-black'
								: ''
							}`}	
							onClick={() => setActiveTarget(target)}>
						</span>
					))}
				</div>
			</div>

			<div className='absolute top-2 left-2'>
				{stock === 0 && <span>Agotado</span>}
			</div>
		</div>
	);
};
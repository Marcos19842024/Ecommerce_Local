import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Type, VariantProduct } from '../../interfaces';
import { formatPrice } from '../../helpers';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCartStore } from '../../store/cart.store';

interface Props {
	name: string;
	targets: {
		target: string,
		types: Type[]
	}[];
	variants: VariantProduct[];
}

export const CardProduct = ({
	name,
	targets,
	variants
}: Props) => {
	const [activeTarget, setActiveTarget] = useState<{
		target: string;
	}>(targets[0]);

	const addItem = useCartStore(state => state.addItem);

	const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (selectedVariant && selectedVariant.stock > 0) {
			addItem({
				variantId: selectedVariant.id,
				productId: name,
				name,
				image: selectedVariant.image,
				target: selectedVariant.target,
				kg: selectedVariant.kg,
				type: selectedVariant.type,
				price: selectedVariant.price,
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
		variant => variant.target === activeTarget.target
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
						src={selectedVariant?.image}
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
				<p className='text-[15px] font-medium'>{formatPrice(selectedVariant?.price || 0)}</p>

				<div className='flex gap-3'>
					{targets.map(target => (
						<span
							key={target.target}
							className={`grid place-items-center w-5 h-5 cursor-pointer ${
									activeTarget.target === target.target
										? 'border border-black'
										: ''
								}`
							}
							onClick={() => setActiveTarget(target)}>
							<span
								className='w-[14px] h-[14px] rounded-full'
							/>{target.types[0].type}
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
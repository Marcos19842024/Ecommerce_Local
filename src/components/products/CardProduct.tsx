import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { VariantProduct } from '../../interfaces';
import { formatPrice } from '../../helpers';
import { useState } from 'react';

interface Props {
	img: string;
	name: string;
	price: number;
	targets: {
		target: string,
		type: string,
		kg: number
	}[];
	variants: VariantProduct[];
}

export const CardProduct = ({
	img,
	name,
	price,
	targets,
	variants,
}: Props) => {
	const [activeTarget] = useState<{
		target: string;
	}>(targets[0]);

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
						src={img}
						alt={name}
						className='object-contain h-full w-full'
					/>
				</div>

				<button className='bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'>
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
							className={`grid place-items-center w-5 h-5 rounded-full cursor-pointer`}
						>
							<span
								className='w-[14px] h-[14px] rounded-full'
							/>{target.type}
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
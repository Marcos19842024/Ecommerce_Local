import { Link } from 'react-router-dom';

interface Props {
	img: string;
	name: string;
	slug: string;
}

export const CardProduct = ({
	img,
	name,
	slug,
}: Props) => {

	return (
		<div className='flex flex-col gap-6 relative'>
			<Link
				to={`/products/${slug}`}
				className='flex relative group overflow-hidden '>
				<div className='flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]'>
					<img
						src={img}
						alt={name}
						className='object-contain h-full w-full'
					/>
				</div>
			</Link>
			<div className='flex flex-col gap-1 items-center'>
				<p className='text-[15px] font-medium'>{name}</p>
			</div>
		</div>
	);
};
import { PreparedProducts } from '../../interfaces';
import { CardProduct } from '../products/CardProduct';

interface Props {
	title: string;
	products: PreparedProducts[];
}

export const ProductGrid = ({ title, products }: Props) => {
	return (
		<div className='my-32'>
			<h2 className='text-3xl font-semibold text-center mb-8 md:text-4xl lg:text-5xl'>
				{title}
			</h2>

			<div className='grid grid-cols-1 gap-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4'>
				{products.map(product => (
					<CardProduct
						key={product.id}
						img={product.images[0]}
						name={product.name}
						price={product.price}
						targets={product.targets}
						variants={product.variants}
					/>
				))}
			</div>
		</div>
	);
};
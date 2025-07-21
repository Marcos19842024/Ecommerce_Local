import { PluginFeedFacebook } from '../components/home/PluginFeedFacebook';
import { ProductGrid } from '../components/home/ProductGrid';
import { ProductGridSkeleton } from '../components/skeletons/ProductGridSkeleton';
import { prepareProducts } from '../helpers';
import { useHomeProducts } from '../hooks';

export const HomePage = () => {
	const {recentProducts, popularProducts, isLoading } = useHomeProducts();
	const preparedRecentProducts = prepareProducts(recentProducts);
	const preparedPopularProducts = prepareProducts(popularProducts);

	return (
		<div>
			<div className='flex flex-col gap-5'>
				<PluginFeedFacebook />
				{isLoading ? (<ProductGridSkeleton numberOfProducts={5}/>) : (
					<ProductGrid
						title='Nuevos Productos'
						products={preparedRecentProducts}
					/>)
				}

				{isLoading ? (<ProductGridSkeleton numberOfProducts={5}/>) : (
					<ProductGrid
						title='Productos Destacados'
						products={preparedPopularProducts}
					/>)
				}
			</div>
		</div>
	);
};
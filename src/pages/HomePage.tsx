import { Brands } from '../components/home/Brands';
import { FeatureGrid } from '../components/home/FeatureGrid';
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
			<FeatureGrid />

			<div className='flex flex-col lg:flex-row gap-1 my-2'>
				<div className='lg:w-8/12 xl:w-9/12 mx-auto flex flex-col gap-5'>
					{isLoading ? (<ProductGridSkeleton numberOfProducts={4}/>) : (
						<ProductGrid
							title='Nuevos Productos'
							products={preparedRecentProducts}
						/>)
					}

					{isLoading ? (<ProductGridSkeleton numberOfProducts={4}/>) : (
						<ProductGrid
							title='Productos Destacados'
							products={preparedPopularProducts}
						/>)
					}
				</div>
			
				<div className='items-center lg:w-4/12 xl:w-4/12 mx-auto flex flex-col gap-5 p-4 bg-gray-950 rounded-lg'>
					<PluginFeedFacebook />

					<Brands />
				</div>
			</div>
		</div>
	);
};
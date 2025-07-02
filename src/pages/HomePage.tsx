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

			<div className='flex flex-col lg:flex-row gap-1 w-full my-2'>
				<div className='lg:w-10/12 xl:w-10/12 mx-auto flex flex-col gap-5'>
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
			
				<div className='items-center w-96 mx-auto flex flex-col gap-1 p-1 bg-gray-950 rounded-md'>
					<PluginFeedFacebook />

					<Brands />
				</div>
			</div>
		</div>
	);
};
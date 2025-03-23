import { useQuery } from '@tanstack/react-query';
import { getProductBySlug } from '../../acctions';

export const useProduct = (name: string) => {
	const {
		data: product,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['product', name],
		queryFn: () => getProductBySlug(name),
		retry: false,
	});

	return {
		product,
		isError,
		isLoading,
	};
};
import { useQuery } from '@tanstack/react-query';
import { getUsersList } from '../../actions';

export const useUsers = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['users'],
		queryFn: getUsersList,
		retry: false,
		refetchOnWindowFocus: true,
	});

	return {
		users: data ?? [],
		isLoading,
	};
};
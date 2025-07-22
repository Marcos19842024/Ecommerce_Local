import { ImSpinner9 } from 'react-icons/im';

export const Loader = () => {
	return (
		<div className='flex items-center justify-center h-screen'>
			<ImSpinner9 className='animate-spin text-cyan-600' size={70} />
		</div>
	);
};
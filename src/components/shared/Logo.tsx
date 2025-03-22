import { Link } from 'react-router-dom';

export const Logo = () => {
	return (
		<Link
			to='/'
			className={`text-2xl font-bold tracking-tighter transition-all`}
		>
			<p className='hidden lg:block'>
				<img src='/img/Baalak-logo-banner.png' alt='Baalak'/>
			</p>

			<p className='flex lg:hidden'>
				<img src='/img/Baalak-logo-banner-small.png' alt='Baalak'/>
			</p>
		</Link>
	);
};
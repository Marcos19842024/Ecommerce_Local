import { IoMdClose } from 'react-icons/io';
import { useGlobalStore } from '../../store/global.store';
import { Link, NavLink } from 'react-router-dom';
import { navbarLinks } from '../../constants/links';

export const NavbarMobile = () => {
	const setActiveNavMobile = useGlobalStore(
		state => state.setActiveNavMobile
	);

	return (
		<div className='bg-white text-black h-screen w-full shadow-lg animate-slide-in-left fixed z-50 flex justify-center py-32'>
			<button
				className='absolute top-5 right-5'
				onClick={() => setActiveNavMobile(false)}
			>
				<IoMdClose size={30} className='text-black' />
			</button>

			{/* Contenido*/}
			<div className='flex flex-col gap-20'>
				<Link
					to='/'
					className='text-4xl font-bold tracking-tighter transition-all'
					onClick={() => setActiveNavMobile(false)}
				>
					<p>
						<img src='/img/Baalak-logo-banner-small.png' alt='Baalak'/>
					</p>
				</Link>

				<nav className='flex flex-col items-center gap-5'>
					{navbarLinks.map(item => (
						<NavLink
							to={item.href}
							key={item.id}
							className={({ isActive }) => `
                                ${
                                    isActive
                                        ? 'text-cyan-600 underline'
                                        : ''
                                } transition-all duration-300 font-semibold text-xl hover:text-cyan-600 hover:underline
                            `}
							onClick={() => setActiveNavMobile(false)}
						>
							{item.title}
						</NavLink>
					))}
				</nav>
			</div>
		</div>
	);
};
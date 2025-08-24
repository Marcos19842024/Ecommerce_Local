import { NavLink } from 'react-router-dom';
import { dashboardLinks } from '../constants/links';

export const Sidebar = () => {
	return (
		<div className='w-[120px] bg-stone-800 text-white flex flex-col gap-10 items-center p-5 fixed h-screen lg:w-[220px]'>
			<nav className='w-full space-y-5 flex-1'>
				{dashboardLinks.map(link => (
					<NavLink
						key={link.id}
						to={link.href}
						className={({ isActive }) =>
							`flex items-center justify-center hover:bg-yellow-500 gap-3 pl-0 py-3 transition-all duration-300 rounded-md ${
								isActive
									? 'text-white bg-cyan-600'
									: 'hover:bg-yellow-500'
							} lg:pl-5 lg:justify-start`
						}>
						{link.icon}
						<p className='font-semibold hidden lg:block'>{link.title}</p>
					</NavLink>
				))}
			</nav>
		</div>
	);
};
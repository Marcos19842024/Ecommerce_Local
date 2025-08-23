import { Link, NavLink } from 'react-router-dom';
import { dashboardLinks } from '../constants/links';
import { IoChevronBack } from 'react-icons/io5';

export const Sidebar = () => {
	return (
		<div className='w-[120px] bg-stone-800 text-white flex flex-col gap-10 items-center p-5 fixed h-screen lg:w-[220px]'>
			<Link
				className='w-full'
				to='/'>
				<button
					className='border w-full rounded-md py-2 border-slate-200 px-5 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest hover:bg-yellow-500 transition-all'>
					<IoChevronBack size={20} />Volver
				</button>
			</Link>

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
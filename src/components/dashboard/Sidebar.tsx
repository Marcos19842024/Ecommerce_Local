import { Link, NavLink } from 'react-router-dom';
import { dashboardLinks } from '../../constants/links';
import { IoChevronBack, IoLogOutOutline } from 'react-icons/io5';
import { signOut } from '../../actions';

export const Sidebar = () => {
	const handleLogout = async () => {
		await signOut();
	};

	return (
		<div className='w-[120px] bg-stone-800 text-white flex flex-col gap-10 items-center p-5 fixed h-screen lg:w-[220px]'>
			<Link
				className='w-full'
				to='/'>
				<button
					className='border w-full rounded-md py-2 border-slate-200 px-5 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest hover:bg-cyan-600 transition-all'>
					<IoChevronBack size={20} />Volver
				</button>
			</Link>

			<nav className='w-full space-y-5 flex-1'>
				{dashboardLinks.map(link => (
					<NavLink
						key={link.id}
						to={link.href}
						className={({ isActive }) =>
							`flex items-center justify-center gap-3 pl-0 py-3 transition-all duration-300 rounded-md ${
								isActive
									? 'text-white bg-cyan-600'
									: 'hover:text-white hover:bg-cyan-600'
							} lg:pl-5 lg:justify-start`
						}>
						{link.icon}
						<p className='font-semibold hidden lg:block'>{link.title}</p>
					</NavLink>
				))}
			</nav>

			<button
				className='bg-red-500 w-full py-[10px] rounded-md flex items-center justify-center gap-2 font-semibold text-sm hover:bg-cyan-600'
				onClick={handleLogout}>
				<span className='hidden lg:block'>Cerrar sesión</span>
				<IoLogOutOutline
					size={20}
					className='inline-block'
				/>
			</button>
		</div>
	);
};
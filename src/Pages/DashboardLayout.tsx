import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const DashboardLayout = () => {
	
	return (
		<div className='flex bg-gray-100 min-h-screen font-montserrat'>
			<Sidebar />
			<main className='container m-5 mt-7 flex-1 text-slate-800 ml-[110px] lg:ml-[220px]'>
				<Outlet />
			</main>
		</div>
	);
};
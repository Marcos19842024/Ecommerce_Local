import { Outlet, useNavigate } from 'react-router-dom';
import { signOut } from '../actions';
import { useUser } from '../hooks';
import { useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Loader } from '../components/shared/Loader';
import { IoLogOutOutline } from 'react-icons/io5';

export const ClientLayout = () => {
	const { isLoading: isLoadingSession } = useUser();

	const navigate = useNavigate();

	useEffect(() => {
		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === 'SIGNED_OUT' || !session) {
				navigate('/login', { replace: true });
			}
		});
	}, [navigate]);

	if (isLoadingSession) return <Loader />;

	const handleLogout = async () => {
		await signOut();
	};

	return (
		<div className='flex flex-col gap-2'>
			{/* Menú */}
			<div className='flex justify-end'>
				<button
					className='bg-cyan-600 py-[10px] rounded-md flex justify-center gap-2 font-semibold text-sm hover:bg-red-500'
					onClick={handleLogout}>
					<span className='hidden lg:block'>Cerrar sesión</span>
					<IoLogOutOutline
						size={20}
						className='inline-block'
					/>
				</button>
			</div>
			<main className='container mt-12 flex-1'>
				<Outlet />
			</main>
		</div>
	);
};
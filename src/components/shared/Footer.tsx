import { Link } from 'react-router-dom';
import { socialLinks } from '../../constants/links';
import Modal from '../modal/Modal';
import { useState } from 'react';

export const Footer = () => {
	const [isOpenMap, setIsOpenMap] = useState(false);
	const openModalMap= () => setIsOpenMap(true);
	const closeModalMap = () => setIsOpenMap(false);

	return (
		<footer
			className='py-4 bg-gray-950 px-2 flex justify-between gap-8 text-slate-200 text-sm flex-wrap mt-5 md:flex-nowrap'>
			<Link
				to='/'
				className={`tracking-tighter flex-5`}>
				<img src='/img/Baalak-logo-footer.png' alt='Baalak'/>
			</Link>

			<div className='flex flex-col gap-4 flex-1'>
				<p className='font-semibold uppercase tracking-tighter'>
					Horarios de atención
				</p>
				<nav className='flex flex-col gap-2 text-xs font-medium'>
					<span className='text-slate-300 hover:text-white'>Lun - Vier  8:00 a.m. - 8:00 p.m.</span>
					<span className='text-slate-300 hover:text-white'>Sab         8:00 a.m. - 5:00 p.m.</span>
					<span className='text-slate-300 hover:text-white'>Dom/Fest    8:00 a.m. - 4:00 p.m.</span>
				</nav>
			</div>

			<div className='flex flex-col gap-4 flex-1'>
				<p className='font-semibold uppercase tracking-tighter'>
					Ubicación
				</p>
				<nav className='flex flex-col gap-2 text-xs font-medium'>
					<div className='flex relative group overflow-hidden items-center gap-6'>
						<span className='text-slate-300 hover:text-white'>
							Av. Central #33, Barrio de Santa Ana, 24050, San Francisco de Campeche, Campeche, México.
						</span>
						<button
							className='bg-white text-black border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'
							onClick={openModalMap}>Ver Ubicación en el mapa
						</button>
						<Modal
							isOpen={isOpenMap}
							closeModal={closeModalMap}>
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3181.4274111452305!2d-90.53723282564627!3d19.83129032782944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85f833e7e7ee3b57%3A0x890db96f7ed2ac60!2sBaalak&#39;%20Clinica%20Veterinaria!5e1!3m2!1ses-419!2smx!4v1748715086040!5m2!1ses-419!2smx"
								width="100%"
								height="100%"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade">
							</iframe>
						</Modal>
					</div>
				</nav>
			</div>

			<div className='flex flex-col gap-4 flex-1'>
				<p className='font-semibold uppercase tracking-tighter'>
					Contacto
				</p>
				<nav className='flex flex-col gap-2 text-xs font-medium'>
					<span className='text-slate-300 hover:text-white'>
						baalak.atencionaclientes@gmail.com
					</span>
					<span className='text-slate-300 hover:text-white'>
						981 811 7853
					</span>
					<span className='text-slate-300 hover:text-white'>
						981 206 2582
					</span>
				</nav>
			</div>

			<div className='flex flex-col gap-4 flex-1'>
				<p className='font-semibold uppercase tracking-tighter'>
					Políticas
				</p>
				<nav className='flex flex-col gap-2 text-xs font-medium'>
					<Link
						to='/aviso_de_privacidad'
						className='text-slate-300 hover:text-white'>
						Políticas de privacidad
					</Link>
					<Link
						to='/terminos_y_condiciones'
						className='text-slate-300 hover:text-white'>
						Términos y condiciones
					</Link>
				</nav>
			</div>

			<div className='flex flex-col gap-4 flex-1'>
				<p className='font-semibold uppercase tracking-tighter'>
					Síguenos en nuestras redes sociales
				</p>
				<div className='flex'>
					{socialLinks.map(link => (
						<a
							key={link.id}
							href={link.href}
							target='_blank'
							rel='noreferrer'
							className='text-slate-300 border border-gray-8000 w-full h-full py-3.5 flex items-center justify-center transition-all hover:bg-white hover:text-gray-950'>
							{link.icon}
						</a>
					))}
				</div>
			</div>
		</footer>
	);
};
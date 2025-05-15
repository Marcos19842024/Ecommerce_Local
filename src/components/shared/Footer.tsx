import { Link } from 'react-router-dom';
import { socialLinks } from '../../constants/links';

export const Footer = () => {
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
					<span className='text-slate-300 hover:text-white'>
						Av. Central #33, Barrio de Santa Ana, 24050, San Francisco de Campeche, Campeche, México.
					</span>
				</nav>
			</div>

			<div className='flex flex-col gap-4 flex-1'>
				<p className='font-semibold uppercase tracking-tighter'>
					Contacto
				</p>
				<nav className='flex flex-col gap-2 text-xs font-medium'>
					<span className='text-slate-300 hover:text-white'>
						baalak.cv@gmail.com
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
						to='/políticas de privacidad'
						className='text-slate-300 hover:text-white'>
						Políticas de privacidad
					</Link>
					<Link
						to='/terminos de uso'
						className='text-slate-300 hover:text-white'>
						Términos de uso
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
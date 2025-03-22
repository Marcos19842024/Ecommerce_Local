export const AboutPage = () => {
	return (
		<div className='space-y-5'>
			<h1 className='text-center text-4xl font-semibold tracking-tight mb-5'>
				Nuestra empresa
			</h1>

			<h2 className='text-2xl font-semibold tracking-tighh mt-8 mb-4'>
				¿Por qué Baalak'?
			</h2>

			<p>
				B de Bienestar del idioma español, cultura actual				
			</p>

			<p>
				aalak' del idioma y cultura Maya, significa "animal doméstico"
			</p>

			<h2 className='text-2xl font-semibold tracking-tighh mt-8 mb-4'>
				Dos culturas, dos idiomas, una sola conciencia y un solo compromiso con el Bienestar animal.
			</h2>

			<img
				src='/img/background-about.png'
				alt='background-about'
				className='h-[600px] w-full object-cover'
			/>

			<div className='flex flex-col gap-4 tracking-tighter leading-7 text-sm font-medium text-slate-800'>
				<p
					className='text-3xl font-semibold tracking-tighh mt-8 mb-4'>
					Contáctenos en
				</p>

				<p
					className='text-cyan-600 font-bold'>
					Avenida Central #33, Barrio de Santa Ana, 24050, San Francisco de Campeche, Campeche, México.
				</p>

				<p
					className='text-cyan-600 font-bold'>
					<a href='baalak.cv@gmail.com'>
						baalak.cv@gmail.com
					</a>{' '}
					o llamado al <a href='tel:981 206 2582'>981 206 2582</a>
				</p>
			</div>
		</div>
	);
};

export const Banner = () => {
	return (
		<div className='relative bg-gray-900 text-white'>
			{/* IMAGEN DE FONDO */}
			<div
				className='absolute inset-0 bg-cover bg-center opacity-70 h-full'
				style={{ backgroundImage: 'url(/img/BackgroundBanner.png)' }}
			/>

			{/* OVERLAY */}
			<div className='absolute inset-0 bg-black opacity-50' />

			{/* CONTENIDO */}
			<div className='relative z-10 flex flex-col items-center justify-center py-20 px-4 text-center lg:py-20 lg:px-8'>
				<h1 className='text-4xl font-bold mb-4 lg:text-6xl'>
					Los mejores productos para el bienestar de tus mascotas
				</h1>

				<p className='text-lg mb-8 lg:text-2xl'>
					Descubre las ofertas exclusivas y las últimas novedades para el cuidado de tus mascotas
				</p>
			</div>
		</div>
	);
};
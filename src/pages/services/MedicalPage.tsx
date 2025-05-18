export const MedicalPage = () => {
    return (
        <div className='relative bg-gray-900 text-white'>
            {/* IMAGEN DE FONDO */}
			<div
				className='absolute inset-0 bg-cover bg-center opacity-50 h-full'
				style={{ backgroundImage: 'url(/img/background-banner.png)' }}
			/>

			{/* OVERLAY */}
			<div className='absolute inset-0 bg-black opacity-50' />

			{/* CONTENIDO */}
			<div className='relative z-10 flex flex-col items-center justify-center py-20 px-4 text-center lg:py-20 lg:px-8'>
				<h1 className='text-4xl font-bold mb-4 lg:text-6xl'>
					Consultas
				</h1>

				<p className='text-lg mb-8 lg:text-2xl'>
					Nuestro sistema de medicina basada en evidencias,
                    asegura un mayor éxito en los diagnósticos y tratamientos de los problema de salud de su mascota,
                    logrando su recuperación en menor tiempo y con menos estrés.
				</p>
			</div>
        </div>
    );
};
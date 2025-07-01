export const Newsletter = () => {
	return (
		<div className='relative bg-gray-500 text-white py-40'>
			{/* IMAGEN DE FONDO */}
			<div
				className='absolute inset-0 bg-cover bg-center opacity-70 h-full'
				style={{
					backgroundImage: 'url(/img/Background-newsletter.png)',
				}}
			/>
		</div>
	);
};
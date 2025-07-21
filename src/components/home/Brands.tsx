const brands = [
	{
		image: '/img/brands/HPM-logo.png',
		alt: 'HPM',
	},
	{
		image: '/img/brands/RoyalCanin-logo.png',
		alt: 'RoyalCanin',
	},
	{
		image: '/img/brands/Proplan-logo.png',
		alt: 'Proplan',
	},
	{
		image: '/img/brands/Hills-logo.png',
		alt: 'Hills',
	},
	{
		image: '/img/brands/Excellent-logo.png',
		alt: 'Excellent',
	},
];

export const Brands = () => {
	return (
		<div className='w-full flex flex-col items-center justify-between gap-1 bg-gray-950'>
			<h2 className='font-bold text-2xl text-white gap-3'>Marcas disponibles</h2>

			<p className='w-2/3 text-center text-sm md:text-base justify-between text-white'>
				Tenemos lo mejor en productos para el cuidado de tus mascotas.
			</p>

			<div className='flex gap-3 mt-4 items-center bg-gray-950 p-1 rounded-lg'>
				{brands.map((brand, index) => (
					<div key={index}>
						<img src={brand.image} alt={brand.alt} className='lg:h-32 lg:w-32 hfull w-full m-2' />
					</div>
				))}
			</div>
		</div>
	);
};
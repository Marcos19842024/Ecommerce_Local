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
	{
		image: '/img/brands/Bayer-logo.png',
		alt: 'Bayer',
	},
	{
		image: '/img/brands/Otras-logo.png',
		alt: 'Otras',
	}
];

export const Brands = () => {
	return (
		<div className='flex flex-col items-center gap-3 pt-16 pb-12'>
			<h2 className='font-bold text-2xl'>Marcas que disponemos</h2>

			<p className='w-2/3 text-center text-sm md:text-base'>
				Tenemos lo mejor en productos para el cuidado interno y externo de tus mascotas
			</p>

			<div className='grid grid-cols-3 gap-6 mt-8 items-center md:grid-cols-6'>
				{brands.map((brand, index) => (
					<div key={index}>
						<img src={brand.image} alt={brand.alt} />
					</div>
				))}
			</div>
		</div>
	);
};
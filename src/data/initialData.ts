export const allProducts = [
	{
		brand: 'Royal Canin',
		name: 'Starter',
		id: 1,
		created_at: new Date().toISOString(),
		targets: [{
			target: "dog",
			type: 'puppy',
			kg: 1.5,
		}],
		price: 449.99,
		images: ['/img/brands/RoyalCanin-logo.png'],
		stock: 10,
		description: {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Descripción de prueba',
						},
					],
				},
			],
		},
		variants: [
			{
				id: 2,
				target: 'cat',
				type: 'adult',
				kg: 4,
				price: 849.00,
				images: ['/img/brands/RoyalCanin-logo.png'],
				stock: 10,
				description: {
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Descripción de prueba',
								},
							],
						},
					],
				}
			}
		]
	},
];

export const recentProducts = [
	{
		brand: 'Royal Canin',
		name: 'Starter',
		id: 1,
		created_at: new Date().toISOString(),
		targets: [{
			target: "dog",
			type: 'puppy',
			kg: 1.5,
		}],
		price: 449.99,
		images: ['/img/brands/RoyalCanin-logo.png'],
		stock: 10,
		description: {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Descripción de prueba',
						},
					],
				},
			],
		},
		variants: [
			{
				id: 2,
				target: 'cat',
				type: 'adult',
				kg: 4,
				price: 849.99,
				images: ['/img/brands/RoyalCanin-logo.png'],
				stock: 10,
				description: {
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Descripción de prueba',
								},
							],
						},
					],
				}
			}
		]
	},
];

export const popularProducts = [
	{
		brand: 'Royal Canin',
		name: 'Starter',
		id: 1,
		created_at: new Date().toISOString(),
		targets: [{
			target: "dog",
			type: 'puppy',
			kg: 1.5,
		}],
		price: 449.99,
		images: ['/img/brands/RoyalCanin-logo.png'],
		stock: 10,
		description: {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Descripción de prueba',
						},
					],
				},
			],
		},
		variants: [
			{
				id: 2,
				target: 'cat',
				type: 'adult',
				kg: 4,
				price: 849.99,
				images: ['/img/brands/RoyalCanin-logo.png'],
				stock: 10,
				description: {
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Descripción de prueba',
								},
							],
						},
					],
				}
			}
		]
	},
];
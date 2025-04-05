import { FaBoxOpen, FaCartShopping, FaFacebookF, FaInstagram } from 'react-icons/fa6';
import { FaWhatsapp } from "react-icons/fa";

export const navbarLinks = [
	{
		id: 1,
		title: 'Inicio',
		href: '/',
	},
	{
		id: 2,
		title: 'Productos',
		href: '/products',
	},
	{
		id: 3,
		title: 'Sobre Nosotros',
		href: '/nosotros',
	},
];

export const socialLinks = [
	{
		id: 1,
		title: 'Facebook',
		href: 'https://www.facebook.com',
		icon: <FaFacebookF />,
	},
	{
		id: 3,
		title: 'Instagram',
		href: 'https://www.instagram.com',
		icon: <FaInstagram />,
	},
	{
		id: 3,
		title: 'Instagram',
		href: 'https://api.whatsapp.com/',
		icon: <FaWhatsapp />,
	},
];

export const dashboardLinks = [
	{
		id: 1,
		title: 'Productos',
		href: '/dashboard/productos',
		icon: <FaBoxOpen size={25} />,
	},
	{
		id: 2,
		title: 'Ordenes',
		href: '/dashboard/ordenes',
		icon: <FaCartShopping size={25} />,
	},
];
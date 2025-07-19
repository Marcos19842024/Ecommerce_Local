import { FaBoxOpen, FaCartShopping, FaFacebookF, FaInstagram, FaTruckPickup } from 'react-icons/fa6';
import { FaWhatsapp } from "react-icons/fa";
import { TbMessageCircleShare, TbReportMoney } from 'react-icons/tb';
import { SiFlatpak } from "react-icons/si";
import { RiBillLine } from 'react-icons/ri';
import { LuUsers } from 'react-icons/lu';

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
	{
		id: 4,
		title: 'Feedback',
		href: '/feedback',
	},
];

export const socialLinks = [
	{
		id: 1,
		title: 'Facebook',
		href: 'https://www.facebook.com/baalak.cv',
		icon: <FaFacebookF />,
	},
	{
		id: 2,
		title: 'Instagram',
		href: 'https://www.instagram.com/baalak.cv',
		icon: <FaInstagram />,
	},
	{
		id: 3,
		title: 'WhatsApp',
		href: 'https://wa.me/message/E7HDZJLVTRDML1',
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
		title: 'Órdenes',
		href: '/dashboard/ordenes',
		icon: <FaCartShopping size={25} />,
	},
	{
		id: 3,
		title: 'Mensajes',
		href: '/dashboard/mensajes',
		icon: <TbMessageCircleShare size={25} />,
	},
	{
		id: 4,
		title: 'Transportes',
		href: '/dashboard/transportes',
		icon: <FaTruckPickup size={25} />,
	},
	{
		id: 5,
		title: 'Reporte',
		href: '/dashboard/reporte',
		icon: <TbReportMoney size={25} />,
	},
	{
		id: 6,
		title: 'Facturas',
		href: '/dashboard/facturas',
		icon: <RiBillLine size={25} />,
	},
	{
		id: 7,
		title: 'Usuarios',
		href: '/dashboard/usuarios',
		icon: <LuUsers size={25} />,
	},
	{
		id: 8,
		title: 'Planogramas',
		href: '/dashboard/planogramas',
		icon: <SiFlatpak size={25} />,
	},
];
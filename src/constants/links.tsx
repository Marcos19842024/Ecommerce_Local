import { FaTruckPickup } from 'react-icons/fa6';
import { TbMessageCircleShare, TbReportMoney } from 'react-icons/tb';
import { RiBillLine } from 'react-icons/ri';

export const dashboardLinks = [
	{
		id: 1,
		title: 'Mensajes',
		href: '/mensajes',
		icon: <TbMessageCircleShare size={25} />,
	},
	{
		id: 2,
		title: 'Transportes',
		href: '/transportes',
		icon: <FaTruckPickup size={25} />,
	},
	{
		id: 3,
		title: 'Reporte',
		href: '/reporte',
		icon: <TbReportMoney size={25} />,
	},
	{
		id: 4,
		title: 'Facturas',
		href: '/facturas',
		icon: <RiBillLine size={25} />,
	},
];
import { FaTruckPickup } from 'react-icons/fa6';
import { TbReportMoney } from 'react-icons/tb';
import { GiOrganigram } from "react-icons/gi";
import { FcDebt } from 'react-icons/fc';

export const dashboardLinks = [
	{
		id: 1,
		title: 'Transportes',
		href: '/transportes',
		icon: <FaTruckPickup size={25} />,
	},
	{
		id: 2,
		title: 'Reporte',
		href: '/reporte',
		icon: <TbReportMoney size={25} />,
	},
	{
		id: 3,
		title: 'Expedientes',
		href: '/expedientes',
		icon: <GiOrganigram size={25} />,
	},
	{
		id: 4,
		title: 'Deudores',
		href: '/deudores',
		icon: <FcDebt size={25} />,
	},
];
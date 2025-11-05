import { FaTruckPickup } from 'react-icons/fa6';
import { TbMessageCircleShare, TbReportMoney } from 'react-icons/tb';
import { GiOrganigram } from "react-icons/gi";
import { VscChecklist } from 'react-icons/vsc';
import { FcDebt } from 'react-icons/fc';

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
		title: 'CheckList',
		href: '/checklist',
		icon: <VscChecklist size={25} />,
	},
	{
		id: 5,
		title: 'Expedientes',
		href: '/expedientes',
		icon: <GiOrganigram size={25} />,
	},
	{
		id: 6,
		title: 'Deudores',
		href: '/deudores',
		icon: <FcDebt size={25} />,
	},
];
import { RxScissors  } from 'react-icons/rx';
import { ImLab  } from 'react-icons/im';
import { TfiPulse  } from 'react-icons/tfi';
import { MdLocalShipping, MdHotel } from 'react-icons/md';
import { ServicesPage } from '../../pages';
import { useState } from 'react';
import Modal from '../modal/Modal';

export const FeatureGrid = () => {
	const [isOpenTransport, setIsOpenTransport] = useState(false);
	const [isOpenMedical, setIsOpenMedical] = useState(false);
	const [isOpenLab, setIsOpenLab] = useState(false);
	const [isOpenEstetica, setIsOpenEstetica] = useState(false);
	const [isOpenPension, setIsOpenPension] = useState(false);

	const openModalTransport = () => setIsOpenTransport(true);
	const closeModalTransport = () => setIsOpenTransport(false);

	const openModalMedical = () => setIsOpenMedical(true);
	const closeModalMedical = () => setIsOpenMedical(false);

	const openModalLab = () => setIsOpenLab(true);
	const closeModalLab = () => setIsOpenLab(false);

	const openModalEstetica = () => setIsOpenEstetica(true);
	const closeModalEstetica = () => setIsOpenEstetica(false);

	const openModalPension = () => setIsOpenPension(true);
	const closeModalPension = () => setIsOpenPension(false);

	return (
		<div className='grid grid-cols-2 gap-8 mt-6 mb-16 lg:grid-cols-5 lg:gap-5'>
			
			<div className='flex relative group overflow-hidden items-center gap-6'>
				<MdLocalShipping
					className='text-slate-600'
					size={40}
				/>
				<div className='space-y-1'>
					<p className='font-semibold'>Servicio de transporte</p>
					<p className='text-sm'>
						Envío de productos y recolección y entrega de mascotas.
					</p>
				</div>
				<button
					className='bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'
					onClick={openModalTransport}>Más información
				</button>
				<Modal
					isOpen={isOpenTransport}
					closeModal={closeModalTransport}>
					<ServicesPage service={'Servicio de transporte'}/>
				</Modal>
			</div>

			<div className='flex relative group overflow-hidden items-center gap-6'>
				<TfiPulse
					className='text-slate-600'
					size={40}
				/>
				<div className='space-y-1'>
					<p className='font-semibold'>Servicio Médico</p>
					<p className='text-sm'>
						Consulta, medicina preventiva, cirugía y hospitalización.
					</p>
				</div>
				<button
					className='bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'
					onClick={openModalMedical}>Más información
				</button>
				<Modal
					isOpen={isOpenMedical}
					closeModal={closeModalMedical}>
					<ServicesPage service={'Servicio Médico'}/>
				</Modal>
			</div>

			<div className='flex relative group overflow-hidden items-center gap-6'>
				<ImLab
					className='text-slate-600'
					size={40}
				/>
				<div className='space-y-1'>
					<p className='font-semibold'>Laboratorio</p>
					<p className='text-sm'>
						Análisis clínicos, pruebas de laboratorio, ultrasonido y rayos x.
					</p>
				</div>
				<button
					className='bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'
					onClick={openModalLab}>Más información
				</button>
				<Modal
					isOpen={isOpenLab}
					closeModal={closeModalLab}>
					<ServicesPage service={'Laboratorio'}/>
				</Modal>
			</div>

			<div className='flex relative group overflow-hidden items-center gap-6'>
				<RxScissors
					className='text-slate-600'
					size={40}
				/>
				<div className='space-y-1'>
					<p className='font-semibold'>Estética</p>
					<p className='text-sm'>
						Baño, corte de pelo, corte de uñas.
					</p>
				</div>
				<button
					className='bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'
					onClick={openModalEstetica}>Más información
				</button>
				<Modal
					isOpen={isOpenEstetica}
					closeModal={closeModalEstetica}>
					<ServicesPage service={'Estética'}/>
				</Modal>
			</div>

			<div className='flex relative group overflow-hidden items-center gap-6'>
				<MdHotel
					className='text-slate-600'
					size={40}
				/>
				<div className='space-y-1'>
					<p className='font-semibold'>Pensión</p>
					<p className='text-sm'>
						Resguardo por noche, con ventilador o aire acondicionado.
					</p>
				</div>
				<button
					className='bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'
					onClick={openModalPension}>Más información
				</button>
				<Modal
					isOpen={isOpenPension}
					closeModal={closeModalPension}>
					<ServicesPage service={'Pensión'}/>
				</Modal>
			</div>
		</div>
	);
};
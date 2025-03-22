import { RxScissors  } from 'react-icons/rx';
import { ImLab  } from 'react-icons/im';
import { TfiPulse  } from 'react-icons/tfi';
import { MdLocalShipping, MdHotel } from 'react-icons/md';

export const FeatureGrid = () => {
	return (
		<div className='grid grid-cols-2 gap-8 mt-6 mb-16 lg:grid-cols-5 lg:gap-5'>
			<div className='flex items-center gap-6'>
				<MdLocalShipping size={40} className='text-slate-600' />

				<div className='space-y-1'>
					<p className='font-semibold'>Servicio de transporte</p>
					<p className='text-sm'>
						Recolección y entrega de mascotas, y envío de productos
					</p>
				</div>
			</div>

			<div className='flex items-center gap-6'>
				<TfiPulse  size={40} className='text-slate-600' />

				<div className='space-y-1'>
					<p className='font-semibold'>Servicio Médico</p>
					<p className='text-sm'>
						Consulta, medicina preventiva, cirugía y hospitalización
					</p>
				</div>
			</div>

			<div className='flex items-center gap-6'>
				<ImLab  size={40} className='text-slate-600' />

				<div className='space-y-1'>
					<p className='font-semibold'>Laboratorio</p>
					<p className='text-sm'>
						Análisis clínicos, pruebas de laboratorio, ultrasonido y rayos x
					</p>
				</div>
			</div>

			<div className='flex items-center gap-6'>
				<RxScissors  size={40} className='text-slate-600' />

				<div className='space-y-1'>
					<p className='font-semibold'>Estética</p>
					<p className='text-sm'>
						Baño, baño medicado, corte de pelo, corte de uñas
					</p>
				</div>
			</div>

			<div className='flex items-center gap-6'>
				<MdHotel  size={40} className='text-slate-600' />

				<div className='space-y-1'>
					<p className='font-semibold'>Pensión</p>
					<p className='text-sm'>
						Resguardo por noche, con ventilador o aire acondicionado
					</p>
				</div>
			</div>
		</div>
	);
};
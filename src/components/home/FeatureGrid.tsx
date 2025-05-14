import { RxScissors  } from 'react-icons/rx';
import { ImLab  } from 'react-icons/im';
import { TfiPulse  } from 'react-icons/tfi';
import { MdLocalShipping, MdHotel } from 'react-icons/md';
import { Link } from 'react-router-dom';

export const FeatureGrid = () => {
	return (
		<div className='grid grid-cols-2 gap-8 mt-6 mb-16 lg:grid-cols-5 lg:gap-5'>
			
			<Link
				to={`/products`}
				className='flex relative group overflow-hidden '>
				<div className='flex items-center gap-6'>
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
				</div>
			</Link>

			<Link
				to={`/products`}
				className='flex relative group overflow-hidden '>
				<div className='flex items-center gap-6'>
					<TfiPulse
						className='text-slate-600'
						size={40}
					/>
					<div className='space-y-1'>
						<p className='font-semibold'>Servicio Médico</p>
						<p className='text-sm'>
							Consulta, medicina preventiva, cirugía y hospitalización
						</p>
					</div>
				</div>
			</Link>

			<Link
				to={`/products`}
				className='flex relative group overflow-hidden '>
				<div className='flex items-center gap-6'>
					<ImLab
						className='text-slate-600'
						size={40}
					/>
					<div className='space-y-1'>
						<p className='font-semibold'>Laboratorio</p>
						<p className='text-sm'>
							Análisis clínicos, pruebas de laboratorio, ultrasonido y rayos x
						</p>
					</div>
				</div>
			</Link>

			<Link
				to={`/products`}
				className='flex relative group overflow-hidden '>
				<div className='flex items-center gap-6'>
					<RxScissors
						className='text-slate-600'
						size={40}
					/>
					<div className='space-y-1'>
						<p className='font-semibold'>Estética</p>
						<p className='text-sm'>
							Baño, corte de pelo, corte de uñas
						</p>
					</div>
				</div>
			</Link>

			<Link
				to={`/products`}
				className='flex relative group overflow-hidden '>
				<div className='flex items-center gap-6'>
					<MdHotel
						className='text-slate-600'
						size={40}
					/>
					<div className='space-y-1'>
						<p className='font-semibold'>Pensión</p>
						<p className='text-sm'>
							Resguardo por noche, con ventilador o aire acondicionado
						</p>
					</div>
				</div>
			</Link>
		</div>
	);
};
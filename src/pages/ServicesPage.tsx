import { CiCircleCheck } from 'react-icons/ci';

type ServicesPageProps = {
	service: string;
};

export const ServicesPage = ({ service }: ServicesPageProps) => {

	return (
		<div
			className='flex flex-col h-screen'>
			<header
				className='text-black flex items-center justify-center flex-col px-10 py-12'>
				<p>
					<img
						src='/img/Baalak-logo-banner.png'
						alt='Baalak'
					/>
				</p>
			</header>

			<main
				className='container flex-1 flex flex-col items-center gap-10'>
				<div
					className='flex gap-3 items-center'>
					<CiCircleCheck size={40} />

					<p className='text-4xl'>
						¡Gracias, ! ESTA ES LA PAGINA DE ' {service} ' PARA LOS SERVICIOS
					</p>
				</div>

				<div className='border border-slate-200 w-full md:w-[600px] p-5 rounded-md space-y-3'>
					<h3 className='font-medium'>Tu pedido está confirmado</h3>

					<p className='text-sm'>Gracias por realizar tu compra en Baalak'.</p>

					<p className='text-sm'>Para realizar la transferencia te compartimos los siguientes	datos</p>

				</div>

				<div className='border border-slate-200 w-full p-5 rounded-md space-y-3 md:w-[600px]'>
					<h3 className='font-medium'>Detalles del pedido</h3>

				</div>
				<div className='flex flex-col justify-between items-center w-full mb-5 gap-3 sm:flex-row md:w-[600px] md:gap-0'>
					<p className='text-sm'>
						¿Necesitas ayuda? Ponte en contacto con nosotros
					</p>
				</div>
			</main>
		</div>
	);
};
import { socialLinks } from '../../constants/links';

export const TransportPage = () => {
    return (
        <div>
            <div className='relative bg-gray-900 text-white'>
                {/* IMAGEN DE FONDO */}
                <div
                    className='absolute inset-0 bg-cover opacity-50 h-full'
                    style={{ backgroundImage: 'url(/img/services/transport.png)' }}
                />

                {/* OVERLAY */}
                <div className='absolute inset-0 bg-black opacity-50' />

                {/* CONTENIDO */}
                <div className='relative z-10 flex flex-col items-center justify-center py-20 px-4 text-center lg:py-20 lg:px-8'>
                    <h1 className='text-4xl font-bold mb-4 lg:text-6xl'>
                        Servicio de transporte
                    </h1>
                    <p className='text-lg mb-8 lg:text-2xl'>
                        <strong>
                            ¿No puedes traerlo? Llámanos
                        </strong>
                    </p>
                    <p className='text-lg mb-8 lg:text-2xl'>
                        Con nosotros tu mascota viajará cómoda y segura, vamos por ella a tu casa y te la regresamos feliz.
                    </p>
                </div>
            </div>
            <button
                className={`rounded-full flex justify-center items-center border border-slate-800 bg-[#25d366] uppercase font-semibold`}>
                <a
                    href={socialLinks[2].href}
                    target='_blank'
                    rel='noreferrer'
                    className='text-slate-200 border border-gray-800 py-3.5 flex items-center justify-center transition-all hover:bg-white hover:text-gray-950'>
                    {socialLinks[2].icon} Reserva tu cita
                </a>
            </button>
        </div>
    );
};
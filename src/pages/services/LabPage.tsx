import { socialLinks } from "../../constants/links";

export const LabPage = () => {
    return (
        <div className='relative bg-gray-900 text-white items-center'>
            {/* IMAGEN DE FONDO */}
            <div
                className='absolute inset-0 bg-cover bg-center opacity-50 h-full'
                style={{ backgroundImage: 'url(/img/services/lab.png)' }}
            />

            {/* OVERLAY */}
            <div className='absolute inset-0 bg-black opacity-50' />
            
            {/* CONTENIDO */}
            <div className='relative z-10 flex flex-col items-center justify-center py-3 px-4 text-center lg:py-3 lg:px-8'>
                <h1 className='text-4xl font-bold mb-4 lg:text-4xl'>
                    Laboratorio
                </h1>
                <h1 className='text-1xl font-bold mb-4 lg:text-2xl'>
                    Laboratorios de análisis clínicos
                </h1>
                <p className='text-lg mb-8 lg:text-2xl'>
                    Es importante realizar análisis clínicos con equipos de alta calidad para obtener resultados confiables que nos ayuden a dar el diagnóstico más preciso.
                </p>
                <p className='text-lg mb-8 lg:text-2xl'>
                    Contamos con equipos de vanguardia, respaldados por laboratorios IDEXX.
                    <a
                        href={'https://al.idexx.com/es-xl/'}
                        target='_blank'
                        rel='noreferrer'
                        className='text-slate-200 py-3.5 flex items-center justify-center transition-all hover:text-blue-500'>
                        https://al.idexx.com/es-xl/
                    </a>
                </p>
            </div>
            <div className='relative z-10 flex flex-col items-center justify-center py-1 px-2 text-center lg:py-1 lg:px-4'>
                <button
                    className={`rounded-full bg-[#2980b9] uppercase font-semibold p-1`}>
                    <a
                        href={socialLinks[2].href}
                        target='_blank'
                        rel='noreferrer'
                        className='text-slate-200 py-2 flex items-center justify-center transition-all hover:text-black'>
                        Reserva tu cita
                    </a>
                </button>
            </div>
        </div>
    );
};
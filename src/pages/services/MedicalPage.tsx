import { socialLinks } from "../../constants/links";

export const MedicalPage = () => {
    return (
        <div className='relative bg-gray-900 text-white items-center'>
            {/* IMAGEN DE FONDO */}
			<div
				className='absolute inset-0 bg-cover bg-center opacity-50 h-full'
				style={{ backgroundImage: 'url(/img/services/medical.png)' }}
			/>

			{/* OVERLAY */}
			<div className='absolute inset-0 bg-black opacity-50' />
			
			{/* CONTENIDO */}
			<div className='relative z-10 flex flex-col items-center justify-center py-5 px-4 text-center lg:py-5 lg:px-8'>
				<h1 className='text-4xl font-bold mb-4 lg:text-4xl'>
					Servico médico
				</h1>
				<h1 className='text-1xl font-bold mb-4 lg:text-2xl'>
					Consultas
				</h1>
				<p className='text-lg mb-8 lg:text-2xl'>
					Nuestro sistema de medicina basada en evidencias,
                    asegura un mayor éxito en los diagnósticos y tratamientos de los problema de salud de su mascota,
                    logrando su recuperación en menor tiempo y con menos estrés.
				</p>
				<h1 className='text-1xl font-bold mb-4 lg:text-2xl'>
					Medicina preventiva
				</h1>
				<p className='text-lg mb-8 lg:text-2xl'>
					Como eres un dueño atento y deseas lo mejor para tu mascota.
					Te animamos a programar un examen de bienestar para mascotas,
					así prevenimos los problemas antes de que surjan, asegurando una mayor salud y felicidad para su pequeñ@.
				</p>
				<h1 className='text-1xl font-bold mb-4 lg:text-2xl'>
					Cirugía y Hospitalización
				</h1>
				<p className='text-lg mb-8 lg:text-2xl'>
					Cuando requieren cuidados médicos especializados o cirugías para recuperar su salud,
					nosotros nos encargamos de darle la mejor atención con el respeto y cariño que ellos requieren.
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
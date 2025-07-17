import {
	Control,
	useFieldArray,
	FieldErrors,
	UseFormRegister,
} from 'react-hook-form';
import { ProductFormValues } from '../../../lib/validators';
import { IoIosAddCircleOutline,	IoIosCloseCircleOutline } from 'react-icons/io';
import { formatString } from '../../../helpers';

interface Props {
	control: Control<ProductFormValues>;
	errors: FieldErrors<ProductFormValues>;
	register: UseFormRegister<ProductFormValues>;
}

const headersVariants = ['Stock', 'Precio', 'Objetivo', 'Tipo', 'Peso', ''];

export const VariantsInput = ({
	control,
	errors,
	register,
}: Props) => {
	const { fields, remove, append } = useFieldArray({
		control,
		name: 'variants',
	});

	const addVariant = () => {
		append({
			stock: 0,
			price: 0,
			target: '',
			type: '',
			kg: 0,
		});
	};

	const removeVariant = (index: number) => {
		remove(index);
	};

	/* const getFirstError = (
		variantErros: FieldErrors<ProductFormValues['variants'][number]>
	) => {
		if (variantErros) {
			const keys = Object.keys(
				variantErros
			) as (keyof typeof variantErros)[];
			if (keys.length > 0) {
				return variantErros[keys[0]]?.message;
			}
		}
	}; */

	return (
		<div className="flex flex-col gap-4">
  			<div className="space-y-4 border-b border-slate-200 pb-6">
				{/* Headers visibles solo en pantallas medianas en adelante */}
				<div className="hidden sm:grid grid-cols-5 gap-4 justify-start">
					{headersVariants.map((header, index) => (
						<p
							key={index}
							className="text-xs font-semibold text-slate-800 uppercase tracking-wide"
						>
							{header}
						</p>
					))}
				</div>

				{fields.map((field, index) => (
					<div key={field.id} className="space-y-2 sm:space-y-0">
						<div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
							<input
								type="number"
								placeholder="Stock"
								{...register(`variants.${index}.stock`, { valueAsNumber: true })}
								className="border rounded-md px-3 py-2 text-sm font-normal placeholder:text-gray-400 focus:outline-none w-full"
							/>

							<input
								type="number"
								step="0.01"
								placeholder="Precio"
								{...register(`variants.${index}.price`, { valueAsNumber: true })}
								className="border rounded-md px-3 py-2 text-sm font-normal placeholder:text-gray-400 focus:outline-none w-full"
							/>

							<input
								type="text"
								placeholder="Target"
								{...register(`variants.${index}.target`)}
								onChange={(e) => formatString(e.target.value)}
								className="border rounded-md px-3 py-2 text-sm font-normal placeholder:text-gray-400 focus:outline-none w-full"
							/>

							<input
								type="text"
								placeholder="Type"
								{...register(`variants.${index}.type`)}
								onChange={(e) => formatString(e.target.value)}
								className="border rounded-md px-3 py-2 text-sm font-normal placeholder:text-gray-400 focus:outline-none w-full"
							/>

							<div className="flex items-center gap-2">
								<input
									type="number"
									placeholder="Kg"
									step="0.01"
									{...register(`variants.${index}.kg`, { valueAsNumber: true })}
									className="border rounded-md px-3 py-2 text-sm font-normal placeholder:text-gray-400 focus:outline-none w-full"
								/>

								<button
									type="button"
									onClick={() => removeVariant(index)}
									className="text-red-600 hover:text-yellow-500 transition-all"
								>
									<IoIosCloseCircleOutline size={22} />
								</button>
							</div>
						</div>

						{errors.variants && errors.variants[index] && (
							<p className="text-red-500 text-xs mt-1">
								{/* {getFirstError(errors.variants[index])} */}
							</p>
						)}
					</div>
				))}
			</div>

			<button
				type="button"
				onClick={addVariant}
				className="px-4 py-2 text-white rounded-md text-sm font-semibold tracking-tight flex items-center gap-2 self-center bg-cyan-600 hover:bg-yellow-500"
			>
				<IoIosAddCircleOutline size={18} />
				Añadir Variante
			</button>

			{fields.length === 0 && errors.variants && (
				<p className="text-red-500 text-xs mt-1 text-center">
					Debes añadir al menos una variante
				</p>
			)}
		</div>
	);
};
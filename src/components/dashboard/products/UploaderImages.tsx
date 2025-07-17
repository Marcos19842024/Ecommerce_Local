import {
	FieldErrors,
	UseFormSetValue,
	UseFormWatch,
} from 'react-hook-form';
import { ProductFormValues } from '../../../lib/validators';
import { useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

interface ImagePreview {
	file?: File;
	previewUrl: string;
}

interface Props {
	setValue: UseFormSetValue<ProductFormValues>;
	watch: UseFormWatch<ProductFormValues>;
	errors: FieldErrors<ProductFormValues>;
}

export const UploaderImages = ({
	setValue,
	errors,
	watch,
}: Props) => {
	const [images, setImages] = useState<ImagePreview[]>([]);

	// Verificar si hay errores con las imágenes
	const formImages = watch('images');

	// Cargar imágenes existentes si las hay en el formulario
	useEffect(() => {
		if (formImages && formImages.length > 0 && images.length == 0) {
			const existingImages = formImages.map(url => ({
				previewUrl: url,
			}));
			setImages(existingImages);

			// Actualizar el valor del formulario
			setValue('images', formImages);
		}
	}, [formImages, images.length, setValue]);

	const handleImageChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files) {
			const newImages = Array.from(e.target.files).map(file => ({
				file,
				previewUrl: URL.createObjectURL(file),
			}));

			const updatedImages = [...images, ...newImages];

			setImages(updatedImages);

			setValue(
				'images',
				updatedImages.map(img => img.file || img.previewUrl)
			);
		}
	};

	const handleRemoveImage = (index: number) => {
		const updatedImages = images.filter((_, i) => i !== index);
		setImages(updatedImages);

		setValue(
			'images',
			updatedImages.map(img => img.file || img.previewUrl)
		);
	};

	return (
		<>
  			{/* Input oculto */}
			<input
				type="file"
				id="inputfile"
				accept="image/*"
				multiple
				onChange={handleImageChange}
				hidden
			/>

			{/* Botón de carga */}
			<label
				htmlFor="inputfile"
				className="bg-cyan-600 w-full text-white flex items-center justify-center py-2 px-4 rounded-md text-sm gap-2 font-semibold hover:bg-yellow-500 cursor-pointer transition-all"
			>
				<i className="fa fa-cloud-upload text-base sm:text-lg" />
				<span>Click para subir imágenes</span>
			</label>

			{/* Galería de previews */}
			<div className="grid grid-cols-2 gap-4 mt-4">
				{images.map((image, index) => (
					<div key={index} className="relative group">
						<div className="border border-gray-200 w-full h-20 sm:h-32 rounded-md p-1 relative bg-white shadow-sm">
							<img
								src={image.previewUrl}
								alt={`Preview ${index}`}
								className="rounded-md w-full h-full object-contain"
							/>

							{/* Botón eliminar */}
							<button
								type="button"
								onClick={() => handleRemoveImage(index)}
								className="absolute top-1 right-1 text-red-500 hover:scale-110 transition-all z-10"
								aria-label="Eliminar imagen"
							>
								<IoIosCloseCircleOutline size={20} />
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Error si no hay imágenes */}
			{formImages?.length === 0 && errors.images && (
				<p className="text-red-500 text-xs mt-2">{errors.images.message}</p>
			)}
		</>
	);
};
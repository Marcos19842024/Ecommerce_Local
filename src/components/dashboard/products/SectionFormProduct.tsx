import { ReactNode } from 'react';

interface Props {
	className?: string;
	titleSection?: string;
	children: ReactNode;
}

export const SectionFormProduct = ({
	className,
	titleSection,
	children,
}: Props) => {
	return (
		<div
			className={`bg-white border border-gray-300 shadow-sm rounded-md flex flex-col gap-4 p-4 sm:p-6 lg:p-7 h-fit ${className}`}
		>
			{titleSection && (
				<h2 className="font-bold tracking-tight text-lg sm:text-xl text-gray-800">
					{titleSection}:
				</h2>
			)}
			{children}
		</div>
	);
};
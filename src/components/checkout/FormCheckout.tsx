import { useForm } from 'react-hook-form';
import { InputAddress } from './InputAddress';
import { AddressFormValues,	addressSchema } from '../../lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { ItemsCheckout } from './ItemsCheckout';
import { useCreateOrder } from '../../hooks';
import { useCartStore } from '../../store/cart.store';
import { ImSpinner2 } from 'react-icons/im';

export const FormCheckout = () => {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<AddressFormValues>({
		resolver: zodResolver(addressSchema),
	});

	const { mutate: createOrder, isPending } = useCreateOrder();

	const cleanCart = useCartStore(state => state.cleanCart);
	const cartItems = useCartStore(state => state.items);
	const totalAmount = useCartStore(state => state.totalAmount);

	const onSubmit = handleSubmit(data => {
		const orderInput = {
			address: data,
			cartItems: cartItems.map(item => ({
				variantId: item.variantId,
				quantity: item.quantity,
				price: item.price,
			})),
			totalAmount,
		};

		createOrder(orderInput, {
			onSuccess: () => {
				cleanCart();
			},
		});
	});

	if (isPending) {
		return (
			<div className='flex flex-col gap-3 h-screen items-center justify-center'>
				<ImSpinner2 className='animate-spin h-10 w-10' />

				<p className='text-sm font-medium'>
					Estamos procesando tu pedido
				</p>
			</div>
		);
	}

	return (
		<div>
			<form className='flex flex-col gap-6' onSubmit={onSubmit}>
				<div className='flex flex-col gap-3'>
					<h3 className='text-lg font-semibold tracking-normal'>
						Entrega
					</h3>

					<InputAddress
						register={register}
						errors={errors}
						name='addressLine1'
						placeholder='Dirección principal'
					/>

					<InputAddress
						register={register}
						errors={errors}
						name='addressLine2'
						placeholder='Dirección adicional (Opcional)'
					/>

					<InputAddress
						register={register}
						errors={errors}
						name='state'
						placeholder='Estado / Provincia'
					/>

					<InputAddress
						register={register}
						errors={errors}
						name='city'
						placeholder='Ciudad'
					/>

					<InputAddress
						register={register}
						errors={errors}
						name='postalCode'
						placeholder='Código Postal'
					/>
				</div>

				<div className='flex flex-col'>
					<div className='flex justify-between items-center text-sm border border-slate-600 bg-stone-100 py-4 rounded-ss-md rounded-se-md px-6'>
						<span>Depósito Bancario</span>
					</div>

					<div className='bg-stone-100 text-[13px] p-5 space-y-0.5 border border-gray-200 rounded-es-md rounded-ee-md'>
						<p>Compra a traves de transferencia bancaria</p>
						<p>Banco Santander</p>
						<p>Razón Social: Francisco Julián Gómez Cancino</p>
						<p>RFC: GOCF630405PW0</p>
						<p>Tipo de cuenta: Corriente</p>
						<p>Número de cuenta: 014050605919441515</p>
						<p>
							La información será compartida nuevamente una vez que se
							haya finalizado la compra
						</p>
					</div>
				</div>

				<div className='flex flex-col gap-6'>
					<h3 className='font-semibold text-3xl'>
						Resumen del pedido
					</h3>

					<ItemsCheckout />
				</div>

				<button
					type='submit'
					className='bg-black text-white py-3.5 font-bold tracking-wide rounded-md mt-2'
				>
					Finalizar Pedido
				</button>
			</form>
		</div>
	);
};
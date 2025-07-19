import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useGlobalStore } from '../../store/global.store';
import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { CartItem } from './CartItem';
import { useCartStore } from '../../store/cart.store';

export const Cart = () => {
	const closeSheet = useGlobalStore(state => state.closeSheet);

	const cartItems = useCartStore(state => state.items);
	const cleanCart = useCartStore(state => state.cleanCart);
	const totalItemsInCart = useCartStore(
		state => state.totalItemsInCart
	);

	return (
		<div className="flex flex-col h-full">
  			{/* Encabezado */}
			<div className="px-5 py-4 flex justify-between items-center border-b border-slate-200">
				<span className="flex gap-2 items-center font-semibold text-sm sm:text-base">
					<HiOutlineShoppingBag size={20} />
					{totalItemsInCart} artículos
				</span>
				<button onClick={closeSheet}>
					<IoMdClose size={24} className="text-black" />
				</button>
			</div>

			{totalItemsInCart > 0 ? (
				<>
					{/* Lista de productos */}
					<div className="p-4 sm:p-6 overflow-auto flex-1">
						<ul className="space-y-6 sm:space-y-8">
							{cartItems.map(item => (
								<CartItem item={item} key={item.variantId} />
							))}
						</ul>
					</div>

					{/* Botones */}
					<div
						className="mt-4 p-4 sm:p-6 h-48"
						style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)" }}
					>
						<Link
							to="/checkout"
							className="w-full bg-cyan-600 hover:bg-yellow-500 text-white py-3 rounded-full flex items-center justify-center gap-2 text-sm sm:text-base"
						>
							<RiSecurePaymentLine size={22} />
							Continuar con la compra
						</Link>

						<button
							className="mt-3 w-full bg-cyan-600 hover:bg-yellow-500 text-white border rounded-full py-3 text-sm sm:text-base"
							onClick={cleanCart}
						>
							Limpiar Carrito
						</button>
					</div>
				</>
			) : (
				<div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
					<p className="text-sm font-medium tracking-tight">
						Su carro está vacío
					</p>
					<Link
						to="/products"
						className="py-3 px-6 bg-cyan-600 hover:bg-yellow-500 rounded-full text-white text-xs sm:text-sm uppercase tracking-wide font-semibold"
						onClick={closeSheet}
					>
						Empezar a comprar
					</Link>
				</div>
			)}
		</div>
	);
};
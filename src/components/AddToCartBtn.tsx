'use client';

import { useCart, type CartProduct } from '../context/CartContext';

interface AddToCartBtnProps {
  product: CartProduct;
}

export function AddToCartBtn({ product }: AddToCartBtnProps) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className="w-full rounded-lg border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
    >
      Add to cart
    </button>
  );
}

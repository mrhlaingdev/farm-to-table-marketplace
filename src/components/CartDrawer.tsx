'use client';

import { useCart } from '../context/CartContext';

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();

  if (!isCartOpen) {
    return null;
  }

  const handleCheckout = () => {
    if (typeof window !== 'undefined') {
      window.alert('Checkout successful! Your order is being prepared.');
    }
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
      <div className="h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Your Cart
            </p>
            <h2 className="text-2xl font-bold text-slate-900">Fresh picks</h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-lg font-semibold text-slate-700">Your cart is empty</p>
            <p className="mt-2 text-sm text-slate-500">
              Add a few farm-fresh items to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-500">
                        {item.unit} • ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-medium text-rose-600 hover:text-rose-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded-full border border-slate-300 px-2.5 py-1 text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center font-semibold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-full border border-slate-300 px-2.5 py-1 text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between text-lg font-semibold text-slate-900">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Checkout Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

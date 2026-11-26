'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartProvider';

export default function CartButton() {
  const { count, setOpen, subtotal } = useCart();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Open your order — ${count} items`}
      className="group fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full border border-gold/50 bg-ink/90 py-2 pl-2 pr-5 text-cream shadow-gold backdrop-blur transition-all duration-500 hover:border-gold hover:bg-wine sm:bottom-7 sm:right-7"
    >
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gold text-ink">
        <ShoppingBag size={18} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-ink bg-ink px-1 text-[10px] font-semibold text-gold">
            {count}
          </span>
        )}
      </span>
      <span className="hidden text-left sm:block">
        <span className="block text-[9px] uppercase tracking-[0.24em] text-beige/70">Your tray</span>
        <span className="block text-[13px] font-medium text-cream">
          {count > 0 ? `${count} item${count > 1 ? 's' : ''}` : 'Order food'}
        </span>
      </span>
      <span className="sr-only">{subtotal}</span>
    </button>
  );
}

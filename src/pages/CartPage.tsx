import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-rose-50/20 pt-28 pb-16 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-3xl mb-4 border border-rose-100">
          🛍️
        </div>
        <h2 className="text-2xl font-serif font-bold text-rose-950 mb-2">Your Shopping Tote is empty</h2>
        <p className="text-rose-950/60 text-sm max-w-sm mb-6 font-sans">
          Explore our luxurious vault of pure skincare elixirs, virgin human hair lace front wigs, and absolute beauty cosmetics.
        </p>
        <Link
          to="/"
          className="px-8 py-3.5 bg-rose-600 text-white rounded-full font-serif font-medium text-sm hover:bg-rose-700 transition-all shadow-sm"
        >
          Discover BelleLuxe Vault
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50/20 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-rose-950">Your Curated Tote</h1>
            <p className="text-xs font-sans text-rose-950/60 mt-1">Review your items before requesting secured giveaway dispatch</p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-serif text-rose-600 hover:text-rose-800 transition-colors underline"
          >
            Empty Tote
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6 mb-8">
          {items.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-rose-50 last:border-0 last:pb-0">
              
              <div className="flex items-start gap-4">
                <img
                  src={item.product.images[0].src}
                  alt=""
                  className="w-20 h-20 rounded-2xl object-cover object-center bg-rose-50 flex-shrink-0 border border-rose-100/50"
                />
                <div>
                  <h3 className="text-base font-serif font-bold text-rose-950">{item.product.name}</h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-rose-950/60 font-sans">
                    {Object.entries(item.selectedOptions).map(([k, v]) => (
                      <span key={k}>
                        <strong className="font-serif">{k}:</strong> {v}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs font-serif font-bold text-rose-600 mt-2">
                    ${item.unitPrice.toFixed(2)} each
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-50">
                <div className="inline-flex items-center rounded-lg border border-rose-200 bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 text-rose-950 hover:bg-rose-50 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-medium text-rose-950">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 text-rose-950 hover:bg-rose-50 font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-sm font-serif font-bold text-rose-950">
                    ${item.totalPrice.toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[11px] text-rose-400 hover:text-rose-600 font-sans mt-1 block ml-auto"
                  >
                    Remove
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Total Summary box */}
        <div className="bg-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="space-y-3 font-sans text-sm pb-4 border-b border-rose-900">
            <div className="flex justify-between">
              <span className="text-white/70">Subtotal Value</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Giveaway Promo Discount</span>
              <span className="text-rose-300 font-serif">Applied (90% OFF Retail MSRP)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">US Standard Express Shipping</span>
              <span className="text-emerald-300 font-medium">FREE</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mb-6">
            <div>
              <span className="text-xs font-serif uppercase tracking-widest text-rose-300 block">Total giveaway due</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <span className="text-xs text-white/50 text-right max-w-xs hidden sm:block font-serif">
              Taxes fully covered by BelleLuxe global sponsorship pool
            </span>
          </div>

          <button
            onClick={() => navigate('/verification')}
            className="w-full py-4 rounded-full bg-white text-rose-950 font-serif font-bold text-base hover:bg-rose-50 transition-all text-center block shadow-sm"
          >
            Proceed to Secure Shipping Address →
          </button>

          <div className="text-center mt-4">
            <Link to="/" className="text-xs text-white/60 hover:text-white transition-colors underline font-serif">
              ← Add more cosmetics or raw hair options
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

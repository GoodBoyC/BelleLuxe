import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, STORAGE_PRICE_MAP, STORAGE_ORIGINAL_PRICE_MAP } from '../data/products';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

export default function HomePage() {
  const navigate = useNavigate();
  const { items } = useCart();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleScrollToFirst = (e: React.MouseEvent) => {
    e.preventDefault();
    const firstItem = document.getElementById(products[0].id);
    if (firstItem) {
      firstItem.scrollIntoView({ behavior: 'smooth' });
    } else {
      const section = document.getElementById('products-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-rose-50/20 to-white text-rose-950 font-sans">
      
      {/* Toast feedback */}
      {successToast && (
        <div className="fixed top-24 right-4 z-50 bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-[slide-in_0.3s_ease-out]">
          <span>✨</span>
          <span className="text-sm font-medium font-serif">{successToast}</span>
        </div>
      )}

      {/* Feminine Premium Hero Section */}
      <section className="relative min-h-[75vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4">
        {/* Soft elegant background decorative blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-100/60 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-100/50 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/80 border border-rose-200 mb-6 shadow-sm">
            <span className="text-rose-700 text-xs font-semibold uppercase tracking-widest font-serif">BelleLuxe Premium Event</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">Official Retail</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light tracking-tight mb-6 leading-[1.15] text-rose-950">
            Timeless Glamour.<br />
            <span className="font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-900 bg-clip-text text-transparent">
              Empowered Grace.
            </span>
          </h1>

          <p className="text-rose-950/70 text-base sm:text-xl max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Elevate your lifestyle with exquisite premium skincare, certified flawless human hair lace wigs, and high-definition complexions. Rebranded exclusively for women.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleScrollToFirst}
              className="px-8 py-4 bg-rose-600 text-white font-serif font-medium rounded-full text-base hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20 hover:shadow-rose-600/30 hover:scale-105 w-full sm:w-auto"
            >
              Shop Collection Now ↓
            </button>
            
            {items.length > 0 && (
              <button
                onClick={() => navigate('/cart')}
                className="px-8 py-4 bg-white text-rose-950 font-serif font-medium rounded-full text-base hover:bg-rose-50 transition-all border border-rose-200 shadow-sm w-full sm:w-auto"
              >
                View Cart ({items.length}) →
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-rose-950/50 text-xs sm:text-sm font-serif">
            <span className="flex items-center gap-1">✨ Official BelleLuxe Retail Pricing</span>
            <span>•</span>
            <span className="flex items-center gap-1">🇺🇸 US Express Shipping</span>
            <span>•</span>
            <span className="flex items-center gap-1">💖 100% Women-Owned Guarantee</span>
          </div>
        </div>
      </section>

      {/* Main product column list carrying full product details and slides */}
      <section id="products-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-widest text-rose-600 font-serif font-semibold">The Featured Vault</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-rose-950 mt-1">Our Curated Bestsellers</h2>
          <div className="w-16 h-0.5 bg-rose-200 mx-auto mt-4" />
        </div>

        {/* Single column stack format presenting varieties of items full details */}
        <div className="space-y-16 sm:space-y-24">
          {products.map(product => (
            <FullProductItemView key={product.id} product={product} onToast={triggerToast} />
          ))}
        </div>
      </section>

      {/* Reassuring Feminine Values */}
      <section className="bg-rose-50/60 border-t border-b border-rose-100/50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center font-serif">
          <div className="p-6 bg-white rounded-3xl border border-rose-50 shadow-sm">
            <div className="text-3xl mb-3">🌸</div>
            <h3 className="text-base font-bold text-rose-950 mb-2">Petal-Soft Standard</h3>
            <p className="text-rose-950/60 text-xs sm:text-sm font-sans leading-relaxed">
              Every formula is clinically calibrated to adapt beautifully to diverse female skin matrix conditions.
            </p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-rose-50 shadow-sm">
            <div className="text-3xl mb-3">👑</div>
            <h3 className="text-base font-bold text-rose-950 mb-2">Raw Authentic Hair</h3>
            <p className="text-rose-950/60 text-xs sm:text-sm font-sans leading-relaxed">
              Sourced directly from verified donor roots with customized micro-knots for optimal seamless parting.
            </p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-rose-50 shadow-sm">
            <div className="text-3xl mb-3">💎</div>
            <h3 className="text-base font-bold text-rose-950 mb-2">Exclusive Event Drop</h3>
            <p className="text-rose-950/60 text-xs sm:text-sm font-sans leading-relaxed">
              Pay merely 10% of true luxury MSRP value as our way of promoting everyday beauty access to women.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-rose-950/50 text-xs font-serif">
        <p>© 2026 BelleLuxe Co. Rebranded premium beauty giveaway event for women. US locations supported exclusively.</p>
      </footer>
    </div>
  );
}

function FullProductItemView({ product, onToast }: { product: Product; onToast: (msg: string) => void }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Set up default option answers
  const initialOptions: Record<string, string> = {};
  product.options.forEach(opt => {
    initialOptions[opt.name] = opt.values[0];
  });
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideOpacity, setSlideOpacity] = useState(1);
  const [quantity, setQuantity] = useState(1);

  // Manual slide handlers (no auto sliding)
  const changeSlide = useCallback((newIdx: number) => {
    setSlideOpacity(0);
    setTimeout(() => {
      setCurrentSlide(newIdx);
      setSlideOpacity(1);
    }, 150);
  }, []);

  const nextSlide = () => changeSlide((currentSlide + 1) % product.images.length);
  const prevSlide = () => changeSlide((currentSlide - 1 + product.images.length) % product.images.length);

  // Look up real per-variant price from the price map
  const getVariantPrice = (discountOrRetail: 'discount' | 'retail'): number => {
    const map = discountOrRetail === 'discount' ? STORAGE_PRICE_MAP : STORAGE_ORIGINAL_PRICE_MAP;
    const productMap = map[product.id];
    if (!productMap) return discountOrRetail === 'discount' ? product.discountPrice : product.originalPrice;

    // Find the first option value that exists in the map
    for (const optVal of Object.values(selectedOptions)) {
      if (productMap[optVal] !== undefined) return productMap[optVal];
    }
    return discountOrRetail === 'discount' ? product.discountPrice : product.originalPrice;
  };

  const currentItemPrice = getVariantPrice('discount');
  const currentOriginalPrice = getVariantPrice('retail');

  const handleOptionSelect = (optName: string, valueString: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optName]: valueString
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, selectedOptions, quantity, currentItemPrice);
    onToast(`Added ${quantity}x ${product.name} to your tote!`);
  };

  const handleOrderNow = () => {
    // Add item to cart and go straight to verification flow
    addToCart(product, selectedOptions, quantity, currentItemPrice);
    navigate('/verification');
  };

  return (
    <div id={product.id} className="scroll-mt-24">
      <div className="bg-white rounded-[2.5rem] border border-rose-100 shadow-sm overflow-hidden transition-all duration-300">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Image Slide Display */}
          <div className="lg:col-span-5 bg-rose-50/30 p-6 sm:p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-rose-100/50">
            
            {/* Category tag */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-rose-500 font-serif font-medium">{product.category}</span>
              {product.badge && (
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-serif font-medium">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Main Picture Slide view */}
            <div className="relative aspect-[4/5] w-full max-w-sm mx-auto rounded-3xl overflow-hidden bg-white shadow-sm border border-rose-50 select-none group">
              <div className="absolute inset-0 transition-opacity duration-150" style={{ opacity: slideOpacity }}>
                <img
                  src={product.images[currentSlide].src}
                  alt={product.images[currentSlide].alt}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Prev / Next controls */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-rose-950 shadow-md hover:bg-white transition-all flex items-center justify-center font-bold text-sm"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-rose-950 shadow-md hover:bg-white transition-all flex items-center justify-center font-bold text-sm"
                aria-label="Next image"
              >
                ›
              </button>

              {/* Slide Counter badge */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-rose-950/70 backdrop-blur-sm text-[11px] font-serif text-white tracking-wider">
                Slide {currentSlide + 1} of {product.images.length}
              </div>
            </div>

            {/* Thumbnail selector ribbon */}
            <div className="flex gap-2.5 mt-4 justify-center overflow-x-auto pb-1 max-w-sm mx-auto w-full">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => changeSlide(i)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    i === currentSlide ? 'border-rose-500 scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  title={img.alt}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <p className="text-center text-rose-950/40 text-[11px] font-serif mt-2 italic">
              {product.images[currentSlide].alt}
            </p>
          </div>

          {/* Right Column: Full Details & Add To Cart flow */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Product header */}
              <div className="mb-2">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-rose-950">{product.name}</h3>
                <p className="text-rose-950/60 text-xs sm:text-sm mt-1 font-sans">{product.tagline}</p>
              </div>

              {/* Reviews score */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-amber-400 text-xs">★★★★★</span>
                <span className="text-xs font-serif font-bold text-rose-950">{product.rating}</span>
                <span className="text-xs text-rose-950/40">({product.reviews.toLocaleString()} real women reviews)</span>
              </div>

              {/* Retail Pricing block */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 mb-6 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-rose-600">
                  ${currentOriginalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-rose-950/60">
                  Selected variant retail price
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-rose-600/10 text-rose-700 font-serif font-bold text-xs uppercase">
                  Retail
                </span>
              </div>

              {/* Full Description text displayed without clicking */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-rose-950/40 font-serif font-medium mb-1">Luxurious Formula Notes</p>
                <p className="text-rose-950/80 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {product.description}
                </p>
              </div>

              {/* Key Highlights columns */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-rose-950/40 font-serif font-medium mb-2">Exquisite Benefits</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-950/80 font-sans">
                  {product.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 mt-0.5">✦</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spec options and ingredients block */}
              <div className="bg-rose-50/30 rounded-xl p-3 mb-6 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {product.ingredientsOrDetails.map(detail => (
                  <div key={detail.label}>
                    <span className="text-rose-950/40 font-serif block">{detail.label}:</span>
                    <span className="text-rose-950 font-medium">{detail.value}</span>
                  </div>
                ))}
              </div>

              {/* Varied Options Selectors */}
              <div className="space-y-4 mb-8">
                {product.options.map(opt => (
                  <div key={opt.name}>
                    <label className="block text-xs font-serif font-medium text-rose-950 mb-1.5">
                      Choose {opt.name}: <span className="text-rose-600 font-sans">{selectedOptions[opt.name]}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleOptionSelect(opt.name, val)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all border ${
                            selectedOptions[opt.name] === val
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-white text-rose-950 hover:bg-rose-50 border-rose-100'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions flow */}
            <div className="pt-4 border-t border-rose-100/60">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-serif text-rose-950/60">Quantity:</span>
                <div className="inline-flex items-center rounded-lg border border-rose-200 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-7 text-rose-950 hover:bg-rose-50 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-medium text-rose-950">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-7 text-rose-950 hover:bg-rose-50 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-rose-950 font-serif font-bold ml-auto">
                  Subtotal: ${(currentItemPrice * quantity).toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 rounded-full bg-rose-50 text-rose-950 font-serif font-medium text-sm hover:bg-rose-100 transition-all border border-rose-200 flex items-center justify-center gap-2"
                >
                  <span>🛍️</span> Add Variant to Cart
                </button>
                
                <button
                  type="button"
                  onClick={handleOrderNow}
                  className="w-full py-3.5 rounded-full bg-rose-600 text-white font-serif font-medium text-sm hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20 active:scale-[0.98]"
                >
                  Order Now →
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

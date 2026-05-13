import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAddress, lookupZipCode, buildAddressString, type AddressSuggestion } from '../utils/addressUtils';
import { useCart } from '../hooks/useCart';

export default function VerificationPage() {
  const navigate = useNavigate();
  const { items, totalPrice } = useCart();

  // If cart is empty, send them back to pick items
  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items.length, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingZip, setLoadingZip] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close address suggestions when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleAddressInput = (value: string) => {
    setFormData(prev => ({ ...prev, address: value }));
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoadingAddress(true);
    searchTimeout.current = setTimeout(async () => {
      const results = await searchAddress(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setLoadingAddress(false);
    }, 400);
  };

  const selectAddress = (suggestion: AddressSuggestion) => {
    const a = suggestion.address;
    setFormData(prev => ({
      ...prev,
      address: buildAddressString(suggestion),
      apartment: a.house_number ? '' : prev.apartment,
      city: a.city || a.suburb || '',
      state: a.state || '',
      zip: a.postcode || '',
    }));
    setShowSuggestions(false);
  };

  const handleZipInput = async (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '').slice(0, 5);
    setFormData(prev => ({ ...prev, zip: cleaned }));
    if (cleaned.length === 5) {
      setLoadingZip(true);
      const result = await lookupZipCode(cleaned);
      if (result) {
        setFormData(prev => ({
          ...prev,
          city: result.city,
          state: result.state,
        }));
      }
      setLoadingZip(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required';
    if (!formData.phone.match(/^\+?[\d\s-()]{10,}$/)) errs.phone = 'Valid phone number required (10+ digits)';
    if (!formData.firstName.trim()) errs.firstName = 'First name required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name required';
    if (!formData.address.trim()) errs.address = 'Address required';
    if (!formData.city.trim()) errs.city = 'City required';
    if (!formData.state.trim()) errs.state = 'State required';
    if (!formData.zip.match(/^\d{5}$/)) errs.zip = 'Valid 5-digit ZIP required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      navigate('/payment', {
        state: {
          verificationPayload: formData,
          totalAmount: totalPrice
        },
      });
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-rose-50/20 text-rose-950 pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Progress Timeline steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 font-serif">
          {['Tote Bundle', 'Shipping Detail', 'Secure Payment', 'Done'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-1.5 sm:gap-2 ${i === 1 ? 'text-rose-600 font-bold' : i < 1 ? 'text-rose-950/60' : 'text-rose-950/30'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border ${
                  i === 1 ? 'border-rose-600 bg-rose-50 text-rose-600 font-bold' : i < 1 ? 'border-rose-950/30 bg-rose-50/50' : 'border-rose-200'
                }`}>
                  {i < 1 ? '✓' : i + 1}
                </div>
                <span className="text-xs sm:text-sm hidden sm:inline">{step}</span>
              </div>
              {i < 3 && <div className={`w-6 sm:w-10 h-0.5 ${i < 1 ? 'bg-rose-300' : 'bg-rose-100'}`} />}
            </div>
          ))}
        </div>

        {/* Small Summary preview banner */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 mb-8 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-serif uppercase tracking-widest text-rose-600 font-medium block">Tote payload summary</span>
            <span className="text-sm font-bold text-rose-950">{items.length} product item variant{items.length !== 1 ? 's' : ''} bundled</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-rose-950/40 block">Due Subtotal</span>
            <span className="text-lg font-serif font-bold text-rose-600">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Verified form */}
        <form onSubmit={handleSubmit} className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="border-b border-rose-50 pb-4 mb-6">
            <h2 className="text-2xl font-serif font-bold text-rose-950">Shipping & Identity Verification</h2>
            <p className="text-xs text-rose-950/60 mt-1 font-sans">
              Enter the legal dispatch destination address. giveaway dispatch restricted strictly to US regions.
            </p>
          </div>

          {/* Contact Details */}
          <div className="mb-6">
            <label className="block text-xs font-serif font-semibold text-rose-950/50 uppercase tracking-widest mb-3">
              Contact notification
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Email address"
                type="email"
                value={formData.email}
                error={errors.email}
                onChange={v => updateField('email', v)}
                placeholder="lady@example.com"
              />
              <Field
                label="Mobile phone"
                type="tel"
                value={formData.phone}
                error={errors.phone}
                onChange={v => updateField('phone', v)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Female Consumer Identity */}
          <div className="mb-6">
            <label className="block text-xs font-serif font-semibold text-rose-950/50 uppercase tracking-widest mb-3">
              Consumer legal identity
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="First name"
                value={formData.firstName}
                error={errors.firstName}
                onChange={v => updateField('firstName', v)}
                placeholder="Jane"
              />
              <Field
                label="Last name"
                value={formData.lastName}
                error={errors.lastName}
                onChange={v => updateField('lastName', v)}
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Realtime Checked Address */}
          <div className="mb-8">
            <label className="block text-xs font-serif font-semibold text-rose-950/50 uppercase tracking-widest mb-3">
              Destination delivery address
            </label>
            
            <div className="space-y-4">
              {/* Address input with typed completion popup */}
              <div className="relative">
                <label className="block text-xs font-medium text-rose-950/80 mb-1.5">
                  Street address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => handleAddressInput(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className={`w-full px-4 py-3 rounded-xl bg-rose-50/20 border text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all text-sm ${
                    errors.address ? 'border-red-400 bg-red-50/10' : 'border-rose-100'
                  }`}
                  placeholder="Start typing delivery address..."
                  autoComplete="street-address"
                />
                
                {loadingAddress && (
                  <div className="absolute right-3 top-9">
                    <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin inline-block" />
                  </div>
                )}

                {/* Suggestions overlay popup */}
                {showSuggestions && suggestions.length > 0 && (
                  <div ref={suggestionsRef} className="absolute z-50 w-full mt-1 bg-white border border-rose-100 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectAddress(s)}
                        className="w-full px-4 py-3 text-left text-xs sm:text-sm text-rose-950 hover:bg-rose-50 border-b border-rose-50/80 last:border-0 flex items-start gap-2.5 transition-colors font-sans"
                      >
                        <span className="text-rose-500 mt-0.5 flex-shrink-0">📍</span>
                        <span className="leading-tight">{s.display_name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {errors.address && <p className="text-red-500 text-xs mt-1 font-sans">{errors.address}</p>}
              </div>

              <Field
                label="Apt / Suite / Unit (optional)"
                value={formData.apartment}
                onChange={v => updateField('apartment', v)}
                placeholder="Apt 3A"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field
                  label="City"
                  value={formData.city}
                  error={errors.city}
                  onChange={v => updateField('city', v)}
                  placeholder="Miami"
                />
                <div className="relative">
                  <Field
                    label="State"
                    value={formData.state}
                    error={errors.state}
                    onChange={v => updateField('state', v)}
                    placeholder="FL"
                  />
                </div>
                <div>
                  <Field
                    label="ZIP Code"
                    value={formData.zip}
                    error={errors.zip}
                    onChange={handleZipInput}
                    placeholder="33101"
                  />
                  {loadingZip && (
                    <p className="text-[10px] text-rose-500 mt-0.5 italic">Looking up city...</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-950/80 mb-1.5">Country</label>
                <div className="px-4 py-3 rounded-xl bg-rose-50/40 border border-rose-100 text-rose-950/60 text-sm flex items-center gap-2 select-none">
                  🇺🇸 United States (Restricted Zone)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 rounded-2xl p-4 mb-6 text-xs text-rose-950/60 font-sans leading-relaxed border border-rose-100/50">
            <strong className="text-rose-950 font-serif block mb-1">Authentic Order Verification Policy</strong>
            BelleLuxe ships luxury goods exclusively to active residential spaces in the US. By proceeding, you verify all provided answers correspond to verified home space locations.
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-rose-600 text-white font-serif font-bold text-base hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20 active:scale-[0.98]"
          >
            Confirm & Continue to Secure Billing →
          </button>
        </form>

      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, error, onChange, placeholder }: {
  label: string; type?: string; value: string; error?: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-rose-950/80 mb-1.5">
        {label} <span className="text-rose-600">*</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl bg-rose-50/20 border text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all text-sm ${
          error ? 'border-red-400 bg-red-50/10' : 'border-rose-100'
        }`}
        placeholder={placeholder}
        autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : undefined}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-sans">{error}</p>}
    </div>
  );
}

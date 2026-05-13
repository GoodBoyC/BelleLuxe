import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import VerificationPage from './pages/VerificationPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminPage from './pages/AdminPage';
import { CartProvider } from './hooks/useCart';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/confirm" element={<ConfirmationPage />} />
          <Route path="/belleluxe/admin" element={<AdminPage />} />
          <Route path="/nover/admin" element={<AdminPage />} />
          <Route path="*" element={
            <div className="min-h-screen bg-rose-50/20 flex flex-col items-center justify-center pt-16 px-4 text-center font-serif">
              <h1 className="text-5xl font-bold text-rose-950 mb-2">404</h1>
              <p className="text-rose-950/60 font-sans text-sm mb-6">The exquisite chamber you are searching for is currently unlisted.</p>
              <a href="/" className="px-6 py-2.5 bg-rose-600 text-white rounded-full text-xs font-sans hover:bg-rose-700 transition-all">
                Return to Beautiful Vault
              </a>
            </div>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}

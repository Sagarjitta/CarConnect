import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import BrowseCarsPage from './components/BrowseCarsPage';
import CarDetailsPage from './components/CarDetailsPage';
import CheckoutPage from './components/CheckoutPage';
import CustomerDashboard from './components/CustomerDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import MyCarsPage from './components/MyCarsPage';
import BookingManagementPage from './components/BookingManagementPage';
import MyBookingsPage from './components/MyBookingsPage';
import UserProfilePage from './components/UserProfilePage';
import AdminDashboard from './components/AdminDashboard';
import { AboutPage, ContactPage } from './components/AboutContactPages';
import { LoginModal, RegisterModal } from './components/AuthModals';
import AddEditCarModal from './components/AddEditCarModal';
import PaymentModal from './components/PaymentModal';
import ReceiptModal from './components/ReceiptModal';
import { api, auth } from './api';
import { Car, Shield, Phone, Mail, MapPin, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(auth.getUser());
  const [currentView, setCurrentView] = useState('home');
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);

  // Active items for detail/checkout
  const [selectedCar, setSelectedCar] = useState(null);
  const [checkoutCar, setCheckoutCar] = useState(null);
  const [checkoutDates, setCheckoutDates] = useState(null);
  const [pendingBookingCar, setPendingBookingCar] = useState(null);

  // Search parameters for BrowseCarsPage
  const [searchParams, setSearchParams] = useState({});

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const loadCars = async () => {
    setLoadingCars(true);
    try {
      const data = await api.cars.search();
      setCars(data || []);
    } catch (err) {
      showToast('Could not load vehicles from server', 'error');
    } finally {
      setLoadingCars(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    setCurrentView('home');
    showToast('Signed out successfully', 'info');
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setIsLoginOpen(false);

    if (pendingBookingCar) {
      const carToBook = pendingBookingCar;
      setPendingBookingCar(null);
      handleBookCar(carToBook);
    } else {
      if (loggedInUser.role === 'ROLE_CAR_OWNER' || loggedInUser.role === 'CAR_OWNER') {
        setCurrentView('owner-dashboard');
      } else if (loggedInUser.role === 'ROLE_ADMIN' || loggedInUser.role === 'ADMIN') {
        setCurrentView('admin');
      } else {
        setCurrentView('browse');
      }
    }
  };

  const handleRegisterSuccess = (registeredUser) => {
    setUser(registeredUser);
    setIsRegisterOpen(false);
    showToast(`Account registered as ${registeredUser.role.replace('ROLE_', '')}!`, 'success');

    if (registeredUser.role === 'ROLE_CAR_OWNER' || registeredUser.role === 'CAR_OWNER') {
      setCurrentView('owner-dashboard');
    } else {
      setCurrentView('browse');
    }
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setCurrentView('car-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookCar = (car, dates = null) => {
    if (!auth.isLoggedIn()) {
      setPendingBookingCar(car);
      showToast('Please sign in or register to reserve this car', 'info');
      setIsLoginOpen(true);
      return;
    }

    const currentUser = auth.getUser();
    if (currentUser && car.owner && (currentUser.id === car.owner.id || currentUser.email === car.owner.email)) {
      showToast('You cannot rent your own vehicle!', 'error');
      return;
    }

    setCheckoutCar(car);
    setCheckoutDates(dates);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (filterParams) => {
    setSearchParams(filterParams);
    setCurrentView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryName) => {
    setSearchParams({ carType: categoryName });
    setCurrentView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingCompleted = (booking) => {
    showToast(`Booking #${booking.id} created successfully!`, 'success');
    setCurrentView('my-bookings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayBooking = (booking) => {
    setPaymentBooking(booking);
  };

  const handlePaymentSuccess = (payment) => {
    setPaymentBooking(null);
    setReceiptData(payment);
    showToast('Payment settled and confirmed!', 'success');
  };

  const handleAddCarSuccess = (newCar) => {
    setIsAddCarOpen(false);
    showToast(`Car ${newCar.brand} ${newCar.model} listed successfully!`, 'success');
    loadCars();
    setCurrentView('my-cars');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <HomePage
            cars={cars}
            onSelectCar={handleSelectCar}
            onBookCar={handleBookCar}
            onSearchSubmit={handleSearchSubmit}
            onCategorySelect={handleCategorySelect}
            setView={setCurrentView}
          />
        )}

        {currentView === 'browse' && (
          <BrowseCarsPage
            cars={cars}
            onSelectCar={handleSelectCar}
            onBookCar={handleBookCar}
            initialFilter={searchParams}
          />
        )}

        {currentView === 'car-details' && selectedCar && (
          <CarDetailsPage
            car={selectedCar}
            onBack={() => setCurrentView('browse')}
            onBookCar={handleBookCar}
            showToast={showToast}
          />
        )}

        {currentView === 'checkout' && checkoutCar && (
          <CheckoutPage
            car={checkoutCar}
            initialDates={checkoutDates}
            onBack={() => setCurrentView('car-details')}
            onSuccess={handleBookingCompleted}
            showToast={showToast}
          />
        )}

        {currentView === 'customer-dashboard' && (
          <CustomerDashboard
            setView={setCurrentView}
            onSelectCar={handleSelectCar}
            showToast={showToast}
          />
        )}

        {currentView === 'owner-dashboard' && (
          <OwnerDashboard
            setView={setCurrentView}
            onAddCarClick={() => setIsAddCarOpen(true)}
            showToast={showToast}
          />
        )}

        {currentView === 'my-cars' && (
          <MyCarsPage
            onAddCarClick={() => setIsAddCarOpen(true)}
            showToast={showToast}
          />
        )}

        {currentView === 'owner-bookings' && (
          <BookingManagementPage
            showToast={showToast}
          />
        )}

        {currentView === 'my-bookings' && (
          <MyBookingsPage
            onPayClick={handlePayBooking}
            showToast={showToast}
          />
        )}

        {currentView === 'profile' && (
          <UserProfilePage
            user={user}
            onProfileUpdated={(updated) => setUser(updated)}
            setView={setCurrentView}
            showToast={showToast}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            showToast={showToast}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            setView={setCurrentView}
            onRegisterClick={() => setIsRegisterOpen(true)}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage
            showToast={showToast}
          />
        )}
      </main>

      {/* Global Modals */}
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onSuccess={handleLoginSuccess}
          onOpenRegister={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }}
          showToast={showToast}
        />
      )}

      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onSuccess={handleRegisterSuccess}
          onOpenLogin={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
          showToast={showToast}
        />
      )}

      {isAddCarOpen && (
        <AddEditCarModal
          onClose={() => setIsAddCarOpen(false)}
          onSuccess={handleAddCarSuccess}
          showToast={showToast}
        />
      )}

      {paymentBooking && (
        <PaymentModal
          booking={paymentBooking}
          onClose={() => setPaymentBooking(null)}
          onSuccess={handlePaymentSuccess}
          showToast={showToast}
        />
      )}

      {receiptData && (
        <ReceiptModal
          payment={receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Modern Automotive Footer */}
      <footer style={{
        background: '#070C1E',
        borderTop: '1px solid var(--border-color)',
        padding: '3.5rem 1.5rem 2rem',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => setCurrentView('home')}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={18} color="#fff" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Car<span style={{ color: 'var(--accent-cyan)' }}>Connect</span></span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                India's premier peer-to-peer car sharing marketplace. Connect with verified local car owners and enjoy hassle-free, insured road trips.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={13} color="#34D399" /> 100% Insured</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={13} color="#34D399" /> KYC Verified</span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Marketplace</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.6rem', fontSize: '0.85rem' }}>
                <li><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} onClick={() => setCurrentView('browse')}>Browse All Cars</button></li>
                <li><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} onClick={() => handleCategorySelect('SUV')}>SUVs & 4x4s</button></li>
                <li><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} onClick={() => handleCategorySelect('Sedan')}>Sedans & Luxury</button></li>
                <li><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} onClick={() => handleCategorySelect('Electric')}>EVs & Hybrids</button></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Car Owners (Hosts)</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.6rem', fontSize: '0.85rem' }}>
                <li><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} onClick={() => setIsRegisterOpen(true)}>List Your Car</button></li>
                <li><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} onClick={() => setCurrentView('owner-dashboard')}>Host Portal</button></li>
                <li><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} onClick={() => setCurrentView('about')}>Host Protection & Payouts</button></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Support & Trust</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.6rem', fontSize: '0.85rem' }}>
                <li><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} onClick={() => setCurrentView('contact')}>24/7 Concierge Helpline</button></li>
                <li><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} onClick={() => setCurrentView('about')}>Safety Standards</button></li>
                <li><button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} onClick={() => setCurrentView('contact')}>FAQ & Roadside Assistance</button></li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div>
              &copy; {new Date().getFullYear()} CarConnect Technologies Private Limited. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setCurrentView('about')}>Privacy Policy</button>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setCurrentView('about')}>Terms of Service</button>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setCurrentView('contact')}>Cancellation Terms</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

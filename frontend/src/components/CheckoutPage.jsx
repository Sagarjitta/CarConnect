import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CreditCard, Check, AlertCircle } from 'lucide-react';
import { api, auth } from '../api';

export default function CheckoutPage({ car, initialDates, onBack, onSuccess, showToast }) {
  const [startDate, setStartDate] = useState(initialDates?.startDate || '');
  const [endDate, setEndDate] = useState(initialDates?.endDate || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  // Simulated Card Info
  const [cardNumber, setCardNumber] = useState('4532 8920 1234 5678');
  const [cardHolder, setCardHolder] = useState(auth.getUser()?.fullName?.toUpperCase() || 'JITTA SAGAR');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('789');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const days = calculateDays();
  const basePrice = days * (car.pricePerDay || 0);
  const platformFee = 250;
  const grandTotal = basePrice + platformFee;

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setErrorMsg('Please select pickup and return dates.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      // Step 1: Create Booking
      const booking = await api.bookings.create({
        carId: car.id,
        startDate,
        endDate,
        notes
      });

      // Step 2: Process mock payment authorization
      const payment = await api.payments.process({
        bookingId: booking.id,
        amount: grandTotal,
        paymentMethod,
        cardNumber: cardNumber.replace(/\s+/g, ''),
        cardHolder,
        expiry,
        cvv
      });

      showToast('Booking submitted and confirmed successfully!', 'success');
      onSuccess(booking, payment);
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const primaryImage = car.images?.find(i => i.isPrimary)?.imageUrl ||
                       car.images?.[0]?.imageUrl ||
                       'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '980px' }}>
      <button className="btn btn-outline btn-sm" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={14} /> Back
      </button>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Booking & Checkout</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Review your trip dates, vehicle details, and confirm your reservation with host protection.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)', gap: '2rem' }}>
        {/* Left Form: Dates, Notes & Payment */}
        <div>
          <form onSubmit={handleSubmit}>
            {/* Trip Dates */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>1. Rental Dates</h3>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Pick-up Date</label>
                  <input
                    type="date"
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Return Date</label>
                  <input
                    type="date"
                    className="form-control"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Note for Host (Optional)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Flight arrives at 10 AM, will pick up at airport..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Simulated Payment Module */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>2. Payment Authorization (Mock Flow)</h3>
                <span className="badge badge-completed">Simulated</span>
              </div>

              {/* Payment Method Selector */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {['CARD', 'UPI', 'NET_BANKING'].map(method => (
                  <button
                    key={method}
                    type="button"
                    className={`btn btn-sm ${paymentMethod === method ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method === 'CARD' ? 'Credit/Debit Card' : method}
                  </button>
                ))}
              </div>

              {paymentMethod === 'CARD' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4532 8920 1234 5678"
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="JITTA SAGAR"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="08/29"
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        className="form-control"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                        placeholder="789"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'UPI' && (
                <div className="form-group">
                  <label className="form-label">Virtual Payment Address (UPI ID)</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="user@okaxis"
                    placeholder="name@upi"
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Mock gateway will automatically approve UPI checkout.
                  </div>
                </div>
              )}

              {paymentMethod === 'NET_BANKING' && (
                <div className="form-group">
                  <label className="form-label">Select Bank</label>
                  <select className="form-control">
                    <option>HDFC Bank</option>
                    <option>State Bank of India</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Processing Checkout...' : `Confirm & Pay ₹${grandTotal.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Right Column: Car Summary & Fare Breakdown */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Rental Summary</h3>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
              <img
                src={primaryImage}
                alt=""
                style={{ width: '90px', height: '65px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{car.brand} {car.model}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {car.city} &bull; {car.carType} &bull; {car.fuelType}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, marginTop: '0.2rem' }}>
                  Hosted by {car.owner?.fullName || 'Verified Host'}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Rental Period:</span>
                <span style={{ fontWeight: 600 }}>{days} Day{days > 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Daily Rate:</span>
                <span>₹{car.pricePerDay?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Base Fare:</span>
                <span>₹{basePrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Platform Protection:</span>
                <span>₹{platformFee}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
                <span>Total Amount:</span>
                <span style={{ color: 'var(--accent-cyan)' }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '0.85rem', fontSize: '0.8rem', color: '#6ee7b7', display: 'flex', gap: '0.5rem' }}>
              <ShieldCheck size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>CarConnect Trip Protection Included</strong>
                <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Includes 24/7 roadside assistance, host insurance coverage, and vehicle inspection verification.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

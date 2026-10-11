import React, { useState } from 'react';
import { api, auth } from '../api';

export default function PaymentModal({ booking, onClose, onSuccess, showToast }) {
  const user = auth.getUser();
  const [cardNumber, setCardNumber] = useState('4532 8920 1234 5678');
  const [cardHolder, setCardHolder] = useState(user?.username ? user.username.toUpperCase() : 'JITTA SAGAR');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('789');
  const [loading, setLoading] = useState(false);

  const getNetwork = () => {
    const raw = cardNumber.replace(/\D/g, '');
    if (raw.startsWith('4')) return 'VISA';
    if (raw.startsWith('5')) return 'MASTERCARD';
    return 'CARD';
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiry(raw);
  };

  const handleTestDecline = () => {
    setCardNumber('4000 0000 0000 0000');
    showToast('Testing simulation: Card set to decline format (ends in 0000)', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payment = await api.payments.process({
        bookingId: booking.id,
        cardNumber: cardNumber.replace(/\s+/g, ''),
        cardHolderName: cardHolder,
        expiryDate: expiry,
        cvv,
        amount: booking.totalPrice,
        paymentMethod: 'CARD'
      });

      showToast('Payment successful! Booking flipped to Paid & Confirmed.', 'success');
      onSuccess(payment);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '480px' }}>
        <div className="dialog-header">
          <h3 className="dialog-title">Simulated Card Payment</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Interactive Credit Card Widget */}
        <div className="card-simulator-wrapper">
          <div className="credit-card">
            <div className="card-top">
              <div className="card-chip"></div>
              <div className="card-network">{getNetwork()}</div>
            </div>
            <div className="card-number">{cardNumber || '•••• •••• •••• ••••'}</div>
            <div className="card-bottom">
              <div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>Cardholder</div>
                <div className="card-holder-name">{cardHolder || 'YOUR NAME'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>Expires</div>
                <div className="card-expiry">{expiry || 'MM/YY'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input
              type="text"
              className="form-control"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength="19"
              placeholder="4111 2222 3333 4444"
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
              <label className="form-label">Expiry Date</label>
              <input
                type="text"
                className="form-control"
                value={expiry}
                onChange={handleExpiryChange}
                maxLength="5"
                placeholder="12/28"
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
                maxLength="4"
                placeholder="123"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Amount Due:</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent)' }}>
              ₹{booking.totalPrice?.toLocaleString()}
            </span>
          </div>

          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginBottom: '0.6rem' }} disabled={loading}>
            {loading ? 'Authorizing Gateway...' : 'Authorize & Confirm (Flip to Paid)'}
          </button>

          <button type="button" className="btn btn-outline btn-sm" style={{ width: '100%', fontSize: '0.75rem' }} onClick={handleTestDecline}>
            Simulate Card Decline (Test 0000)
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function BookingModal({ variant, onClose, onSuccess, showToast }) {
  const formatLocalDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const today = new Date();
  const todayStr = formatLocalDate(today);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatLocalDate(tomorrow);

  const future = new Date();
  future.setDate(future.getDate() + 3);
  const futureStr = formatLocalDate(future);

  const [fromDate, setFromDate] = useState(tomorrowStr);
  const [toDate, setToDate] = useState(futureStr);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const calculateDays = () => {
    if (!fromDate || !toDate) return 1;
    const d1 = new Date(fromDate);
    const d2 = new Date(toDate);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const days = calculateDays();
  const totalPrice = days * (variant?.pricePerDay || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const booking = await api.bookings.create({
        variantId: variant.id,
        fromDate,
        toDate
      });
      showToast('Booking reservation created! Status: Pending.', 'success');
      onSuccess(booking);
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="dialog-header">
          <h3 className="dialog-title">Reserve Vehicle</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{variant.name}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Brand: {variant.company?.name} &bull; Daily Rate: ₹{variant.pricePerDay?.toLocaleString()} &bull; Fuel: {variant.fuel}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Pick-up Date (From)</label>
              <input
                type="date"
                className="form-control"
                min={todayStr}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Drop-off Date (To)</label>
              <input
                type="date"
                className="form-control"
                min={fromDate}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Rental Duration:</span>
              <span style={{ fontWeight: 600 }}>{days} Day{days > 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Total Price:</span>
              <span style={{ color: 'var(--accent)' }}>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <strong>Error:</strong> {errorMsg}
            </div>
          )}

          <button type="submit" className="btn btn-accent" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Validating Availability...' : 'Confirm Reservation (Status: Pending)'}
          </button>
        </form>
      </div>
    </div>
  );
}

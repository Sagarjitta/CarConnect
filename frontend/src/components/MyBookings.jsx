import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { RefreshCw, CreditCard, XCircle, FileText } from 'lucide-react';

export default function MyBookings({ onPayClick, onShowReceipt, showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.bookings.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      showToast('Failed to load reservations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.bookings.cancel(id);
      showToast('Booking reservation cancelled', 'info');
      fetchBookings();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'badge-approved';
      case 'PAID_AND_CONFIRMED': return 'badge-paid';
      case 'COMPLETED': return 'badge-completed';
      case 'CANCELLED':
      case 'DEACTIVATED': return 'badge-cancelled';
      default: return 'badge-pending';
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>My Reservations</h2>
        <button className="btn btn-secondary btn-sm" onClick={fetchBookings}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle / Variant</th>
              <th>Registration No</th>
              <th>Dates (From - To)</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem' }}>
                  Loading reservations...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                  No reservations found yet. Browse our fleet and reserve your first ride!
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td><strong>{b.vehicle?.variant?.name || 'Variant'}</strong></td>
                  <td><code>{b.vehicle?.regNumber || 'Assigned'}</code></td>
                  <td>{b.fromDate} &rarr; {b.toDate}</td>
                  <td><strong>₹{b.totalPrice?.toLocaleString()}</strong></td>
                  <td>
                    <span className={`badge ${getBadgeClass(b.status)}`}>
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-accent btn-sm"
                          onClick={() => onPayClick(b)}
                        >
                          <CreditCard size={14} /> Pay Now
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(b.id)}
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      </div>
                    )}
                    {b.status === 'PAID_AND_CONFIRMED' && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onShowReceipt(b.id)}
                      >
                        <FileText size={14} /> Receipt
                      </button>
                    )}
                    {b.status === 'COMPLETED' || b.status === 'CANCELLED' ? (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Settled</span>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

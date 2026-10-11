import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { RefreshCw, CreditCard, XCircle, FileText, Star, MessageSquare } from 'lucide-react';
import ReceiptModal from './ReceiptModal';

export default function MyBookingsPage({ onPayClick, showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.bookings.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      showToast('Could not load reservations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking reservation?')) return;
    try {
      await api.bookings.cancel(id);
      showToast('Booking reservation cancelled successfully', 'info');
      fetchBookings();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleShowReceipt = async (bookingId) => {
    try {
      const p = await api.payments.getByBookingId(bookingId);
      setSelectedReceipt(p);
    } catch (err) {
      showToast('Could not load transaction receipt', 'error');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingReview(true);
    try {
      await api.reviews.addReview({
        carId: reviewBooking.car.id,
        rating: Number(rating),
        comment: comment.trim()
      });
      showToast('Thank you! Your review was published.', 'success');
      setReviewBooking(null);
      setComment('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  const getBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'badge-confirmed';
      case 'COMPLETED': return 'badge-completed';
      case 'REJECTED':
      case 'CANCELLED': return 'badge-rejected';
      default: return 'badge-pending';
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>My Trip Reservations</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track booking status, complete checkout payments, and leave ratings for completed trips.</p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={fetchBookings}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Host / City</th>
              <th>Dates (From &rarr; To)</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading reservations...
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛣️</div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>No Trips Found</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    You have no reservations matching this category.
                  </p>
                </td>
              </tr>
            ) : (
              filteredBookings.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>
                    <strong>{b.car?.brand} {b.car?.model}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.car?.carType} &bull; <code>{b.car?.regNumber}</code></div>
                  </td>
                  <td>
                    <div>{b.car?.owner?.fullName || 'Verified Host'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.car?.city}</div>
                  </td>
                  <td>
                    <div>{b.startDate} &rarr; {b.endDate}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.totalDays} Day{b.totalDays > 1 ? 's' : ''}</div>
                  </td>
                  <td><strong style={{ color: 'var(--accent-cyan)' }}>₹{b.totalPrice?.toLocaleString()}</strong></td>
                  <td>
                    <span className={`badge ${getBadgeClass(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {b.status === 'PENDING' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(b.id)}
                        >
                          <XCircle size={13} /> Cancel
                        </button>
                      )}

                      {b.status === 'CONFIRMED' && (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onPayClick(b)}
                          >
                            <CreditCard size={13} /> Pay / Checkout
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleCancel(b.id)}
                          >
                            <XCircle size={13} /> Cancel
                          </button>
                        </>
                      )}

                      {b.status === 'COMPLETED' && (
                        <>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleShowReceipt(b.id)}
                          >
                            <FileText size={13} /> Receipt
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setReviewBooking(b)}
                          >
                            <Star size={13} color="#FBBF24" /> Review Host
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Dialog */}
      {reviewBooking && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Review Host & Vehicle</h3>
              <button className="modal-close-btn" onClick={() => setReviewBooking(null)}>&times;</button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700 }}>{reviewBooking.car?.brand} {reviewBooking.car?.model}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Host: {reviewBooking.car?.owner?.fullName} &bull; Trip: {reviewBooking.startDate} to {reviewBooking.endDate}
              </div>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label className="form-label">Rating (1 to 5 Stars)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.8rem',
                        cursor: 'pointer',
                        color: star <= rating ? '#FBBF24' : 'var(--text-subtle)'
                      }}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Review Comment</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Share details about the car's condition, driving feel, and communication with the host..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setReviewBooking(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}

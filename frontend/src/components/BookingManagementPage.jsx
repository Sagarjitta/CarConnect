import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { RefreshCw, Check, X, CheckCheck } from 'lucide-react';

export default function BookingManagementPage({ showToast }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.owner.getBookings();
      setRequests(data || []);
    } catch (err) {
      showToast('Could not load rental requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAccept = async (id) => {
    try {
      await api.owner.acceptBooking(id);
      showToast(`Booking #${id} accepted!`, 'success');
      fetchBookings();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for declining this request (optional):');
    if (reason === null) return;
    try {
      await api.owner.rejectBooking(id, reason);
      showToast(`Booking #${id} declined.`, 'info');
      fetchBookings();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this rental trip as completed?')) return;
    try {
      await api.owner.completeBooking(id);
      showToast(`Trip #${id} completed successfully!`, 'success');
      fetchBookings();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredRequests = requests.filter(r => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
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
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Rental Request Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review customer booking inquiries, confirm availability, and settle completed trips.</p>
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
            className={`tab-btn ${statusFilter === tab ? 'active' : ''}`}
            onClick={() => setStatusFilter(tab)}
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
              <th>Car</th>
              <th>Customer</th>
              <th>Trip Dates</th>
              <th>Total Earnings</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading rental requests...
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No requests found matching current filter.
                </td>
              </tr>
            ) : (
              filteredRequests.map(r => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>
                    <strong>{r.car?.brand} {r.car?.model}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><code>{r.car?.regNumber}</code></div>
                  </td>
                  <td>
                    <strong>{r.customer?.fullName}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.customer?.phone || r.customer?.email}</div>
                  </td>
                  <td>
                    <div>{r.startDate} &rarr; {r.endDate}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.totalDays} day rental</div>
                  </td>
                  <td><strong style={{ color: 'var(--accent-emerald)' }}>₹{r.totalPrice?.toLocaleString()}</strong></td>
                  <td>
                    <span className={`badge ${getBadgeClass(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ background: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}
                          onClick={() => handleAccept(r.id)}
                          title="Accept Request"
                        >
                          <Check size={13} /> Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(r.id)}
                          title="Decline Request"
                        >
                          <X size={13} /> Decline
                        </button>
                      </div>
                    )}
                    {r.status === 'CONFIRMED' && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleComplete(r.id)}
                        title="Mark Trip Completed"
                      >
                        <CheckCheck size={13} /> Complete Trip
                      </button>
                    )}
                    {(r.status === 'COMPLETED' || r.status === 'REJECTED' || r.status === 'CANCELLED') && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Settled</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

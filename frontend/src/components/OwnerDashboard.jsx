import React, { useState, useEffect } from 'react';
import { api, auth } from '../api';
import { DollarSign, Car, CalendarCheck, Clock, Plus, Check, X, ChevronRight, AlertCircle } from 'lucide-react';

export default function OwnerDashboard({ setView, onAddCarClick, showToast }) {
  const user = auth.getUser();
  const [analytics, setAnalytics] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsData, bookingsData] = await Promise.all([
        api.owner.getAnalytics(),
        api.owner.getBookings()
      ]);
      setAnalytics(analyticsData);
      setRequests(bookingsData || []);
    } catch (err) {
      showToast('Could not load owner dashboard telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (id) => {
    try {
      await api.owner.acceptBooking(id);
      showToast(`Booking #${id} accepted! Status flipped to Confirmed.`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Provide a reason for declining this request (optional):');
    if (reason === null) return;
    try {
      await api.owner.rejectBooking(id, reason);
      showToast(`Booking #${id} rejected.`, 'info');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #101F42 0%, #17326E 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <span className="badge badge-confirmed" style={{ marginBottom: '0.5rem' }}>Car Owner Portal</span>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>Host Dashboard: {user?.fullName}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Monitor your peer-to-peer fleet, review incoming reservation requests, and track your rental revenue.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={onAddCarClick}>
            <Plus size={16} /> Add New Car Listing
          </button>
          <button className="btn btn-outline" onClick={() => setView('my-cars')}>
            <Car size={16} /> My Fleet ({analytics?.activeListings || 0})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Estimated Total Earnings</span>
            <DollarSign size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            ₹{analytics?.totalEarnings?.toLocaleString() || 0}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Car Listings</span>
            <Car size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800 }}>
            {analytics?.activeListings || 0}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pending Rental Requests</span>
            <Clock size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fbbf24' }}>
            {pendingRequests.length}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Completed Trips</span>
            <CalendarCheck size={18} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800 }}>
            {analytics?.completedRentals || 0}
          </div>
        </div>
      </div>

      {/* Pending Booking Requests Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Pending Booking Requests Requiring Action</h2>
          <button className="btn btn-outline btn-sm" onClick={() => setView('owner-bookings')}>
            View All Rental Requests <ChevronRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading incoming requests...
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>All Caught Up!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              You have no pending rental requests waiting for approval right now.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {pendingRequests.map(r => (
              <div key={r.id} className="card" style={{ border: '1px solid var(--accent-amber)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span className="badge badge-pending">Action Required</span>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '0.4rem' }}>{r.car?.brand} {r.car?.model}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Customer: <strong>{r.customer?.fullName}</strong> &bull; {r.customer?.phone || r.customer?.email}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      ₹{r.totalPrice?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.totalDays} day rental</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid var(--border-light)' }}>
                  📅 Requested: <strong>{r.startDate}</strong> &rarr; <strong>{r.endDate}</strong>
                  {r.notes && (
                    <div style={{ marginTop: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <em>"{r.notes}"</em>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, background: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}
                    onClick={() => handleAccept(r.id)}
                  >
                    <Check size={14} /> Accept Request
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleReject(r.id)}
                  >
                    <X size={14} /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

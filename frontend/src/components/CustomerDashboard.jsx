import React, { useState, useEffect } from 'react';
import { api, auth } from '../api';
import { CalendarCheck, Car, CreditCard, Clock, CheckCircle2, ChevronRight, User } from 'lucide-react';

export default function CustomerDashboard({ setView, onSelectCar, showToast }) {
  const user = auth.getUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.bookings.getMyBookings();
        setBookings(data || []);
      } catch (err) {
        showToast('Could not load booking history', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const totalSpent = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
                             .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #101F42 0%, #152C61 100%)',
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
          <span className="badge badge-confirmed" style={{ marginBottom: '0.5rem' }}>Customer Portal</span>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>Welcome, {user?.fullName || 'Traveler'}!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your car rentals, review trip itineraries, and discover new destinations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setView('browse')}>
            <Car size={16} /> Browse Fleet
          </button>
          <button className="btn btn-outline" onClick={() => setView('my-bookings')}>
            <CalendarCheck size={16} /> All Reservations
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active / Pending Trips</span>
            <Clock size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{activeBookings.length}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Completed Rentals</span>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{completedBookings.length}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Spent</span>
            <CreditCard size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            ₹{totalSpent?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Active & Upcoming Trips */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Upcoming & In-Progress Reservations</h2>
          <button className="btn btn-outline btn-sm" onClick={() => setView('my-bookings')}>
            View All Trips <ChevronRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading trip reservations...
          </div>
        ) : activeBookings.length === 0 ? (
          <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌴</div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>No Active Bookings Right Now</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              You don't have any upcoming trips scheduled. Find an exceptional car for your next drive!
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => setView('browse')}>
              Rent a Car
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {activeBookings.map(b => (
              <div key={b.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-confirmed' : 'badge-pending'}`}>
                      {b.status}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '0.4rem' }}>{b.car?.brand} {b.car?.model}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Host: {b.car?.owner?.fullName || 'Host'} &bull; {b.car?.city}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                      ₹{b.totalPrice?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.totalDays} days</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid var(--border-light)' }}>
                  📅 <strong>{b.startDate}</strong> &rarr; <strong>{b.endDate}</strong>
                </div>

                <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => setView('my-bookings')}>
                  View Reservation Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

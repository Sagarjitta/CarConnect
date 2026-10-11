import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Calendar, Edit3, CheckCircle2, Car, CalendarCheck, Save } from 'lucide-react';
import { api, auth } from '../api';

export default function UserProfilePage({ user, onProfileUpdated, setView, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || ''
  });
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ bookingsCount: 0, carsCount: 0 });

  const role = user?.role?.replace('ROLE_', '') || 'CUSTOMER';

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || ''
      });
      // Fetch user specific stats
      const fetchQuickStats = async () => {
        try {
          if (role === 'CUSTOMER') {
            const b = await api.bookings.getMyBookings();
            setStats(prev => ({ ...prev, bookingsCount: b?.length || 0 }));
          } else if (role === 'CAR_OWNER') {
            const [c, b] = await Promise.all([
              api.owner.getMyCars(),
              api.owner.getBookings()
            ]);
            setStats({ carsCount: c?.length || 0, bookingsCount: b?.length || 0 });
          }
        } catch (e) {
          // ignore background stats load error
        }
      };
      fetchQuickStats();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await api.users.updateProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim()
      });
      auth.setUser(updatedUser);
      onProfileUpdated(updatedUser);
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const roleBadgeClass = {
    'ADMIN': 'badge-rejected',
    'CAR_OWNER': 'badge-confirmed',
    'CUSTOMER': 'badge-pending'
  }[role] || 'badge-pending';

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '900px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #101F42 0%, #152C61 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#fff',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
          }}>
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.6rem', margin: 0 }}>{user?.fullName || 'User Profile'}</h1>
              <span className={`badge ${roleBadgeClass}`}>
                {role.replace('_', ' ')}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2024'}
            </p>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
              <Edit3 size={15} /> Edit Profile
            </button>
          ) : (
            <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Details / Edit Form */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--accent-blue)" /> Account Details
          </h2>

          {!isEditing ? (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <Mail size={18} color="var(--text-muted)" />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</div>
                  <div style={{ fontWeight: 600 }}>{user?.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <Phone size={18} color="var(--text-muted)" />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone Number</div>
                  <div style={{ fontWeight: 600 }}>{user?.phone || 'Not provided'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <Shield size={18} color="var(--text-muted)" />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Platform Role</div>
                  <div style={{ fontWeight: 600 }}>{role.replace('_', ' ')}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CheckCircle2 size={18} color="var(--badge-green-text)" />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verification Status</div>
                  <div style={{ fontWeight: 600, color: 'var(--badge-green-text)' }}>Identity Verified & Active</div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your Full Legal Name"
                  required
                />
              </div>

              <div>
                <label className="form-label">Email Address (Read-Only)</label>
                <input
                  type="email"
                  className="form-control"
                  value={user?.email || ''}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          )}
        </div>

        {/* Quick Actions & Activity Summary */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Quick Actions</h2>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {role === 'CUSTOMER' && (
                <>
                  <button className="btn btn-primary" onClick={() => setView('browse')}>
                    <Car size={16} /> Browse & Rent Cars
                  </button>
                  <button className="btn btn-secondary" onClick={() => setView('my-bookings')}>
                    <CalendarCheck size={16} /> View My Bookings ({stats.bookingsCount})
                  </button>
                  <button className="btn btn-outline" onClick={() => setView('customer-dashboard')}>
                    View Customer Dashboard
                  </button>
                </>
              )}

              {role === 'CAR_OWNER' && (
                <>
                  <button className="btn btn-primary" onClick={() => setView('my-cars')}>
                    <Car size={16} /> Manage Vehicle Fleet ({stats.carsCount})
                  </button>
                  <button className="btn btn-secondary" onClick={() => setView('owner-bookings')}>
                    <CalendarCheck size={16} /> Rental Requests ({stats.bookingsCount})
                  </button>
                  <button className="btn btn-outline" onClick={() => setView('owner-dashboard')}>
                    View Host Earnings Dashboard
                  </button>
                </>
              )}

              {role === 'ADMIN' && (
                <>
                  <button className="btn btn-primary" onClick={() => setView('admin')}>
                    <Shield size={16} /> Open Admin Control Panel
                  </button>
                  <button className="btn btn-outline" onClick={() => setView('browse')}>
                    Inspect Live Fleet
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'rgba(37, 99, 235, 0.05)', borderColor: 'rgba(37, 99, 235, 0.2)' }}>
            <h3 style={{ fontSize: '1rem', color: '#60A5FA', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} /> Security & Account Protection
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              Your CarConnect account is secured with role-based JWT authentication and encrypted data transport. Need assistance? Contact our 24/7 trust & safety team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

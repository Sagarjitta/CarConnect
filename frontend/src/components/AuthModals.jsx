import React, { useState } from 'react';
import { api, auth } from '../api';
import { User, KeyRound, Shield, AlertCircle } from 'lucide-react';

export function LoginModal({ onClose, onSuccess, onOpenRegister, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.auth.login({ email: email.trim(), password });
      auth.setToken(res.token);
      auth.setUser(res.user);
      showToast(`Welcome back, ${res.user.fullName}!`, 'success');
      onSuccess(res.user);
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.4rem' }}>Sign In to CarConnect</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Quick Demo Credentials Buttons */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Quick 1-Click Demo Accounts:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fillDemo('customer@carconnect.com', 'customer123')}
                title="Customer: Jitta Sagar"
              >
                <User size={13} color="#38BDF8" /> Customer
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fillDemo('owner1@carconnect.com', 'owner123')}
                title="Car Owner: Rajesh Sharma"
              >
                <KeyRound size={13} color="#34D399" /> Owner
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fillDemo('admin@carconnect.com', 'admin123')}
                title="Admin: System Administrator"
              >
                <Shield size={13} color="#60A5FA" /> Admin
              </button>
            </div>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { onClose(); onOpenRegister(); }}
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}

export function RegisterModal({ onClose, onSuccess, onOpenLogin, showToast }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('CUSTOMER'); // CUSTOMER or CAR_OWNER
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.auth.register({
        fullName,
        email: email.trim(),
        password,
        role,
        phone,
        city,
        address
      });
      auth.setToken(res.token);
      auth.setUser(res.user);
      showToast(`Account created successfully as ${role === 'CAR_OWNER' ? 'Car Owner' : 'Customer'}!`, 'success');
      onSuccess(res.user);
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.4rem' }}>Create Your CarConnect Account</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Selection Cards */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">I want to join CarConnect as:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                onClick={() => setRole('CUSTOMER')}
                style={{
                  border: role === 'CUSTOMER' ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                  background: role === 'CUSTOMER' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>🚗</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Customer</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rent cars for trips</div>
              </div>

              <div
                onClick={() => setRole('CAR_OWNER')}
                style={{
                  border: role === 'CAR_OWNER' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                  background: role === 'CAR_OWNER' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>🔑</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Car Owner</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>List cars & earn income</div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Rahul Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Hyderabad, Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Residential / Office address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { onClose(); onOpenLogin(); }}
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}

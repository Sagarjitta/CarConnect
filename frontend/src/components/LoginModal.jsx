import React, { useState } from 'react';
import { api, auth } from '../api';

export default function LoginModal({ onClose, onSuccess, onOpenRegister, showToast }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoAdmin = () => {
    setIdentifier('admin');
    setPassword('admin123');
  };

  const handleDemoCustomer = () => {
    setIdentifier('customer@example.com');
    setPassword('customer123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.login({
        usernameOrEmail: identifier.trim(),
        password
      });

      auth.setToken(res.token);
      auth.setUser({
        id: res.id,
        username: res.username,
        email: res.email,
        role: res.role
      });

      showToast(`Welcome back, ${res.username || 'User'}!`, 'success');
      onSuccess(res);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="dialog-header">
          <h3 className="dialog-title">Login to Account</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <input
              type="text"
              className="form-control"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="customer@example.com or admin"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleDemoCustomer}>
              Fill Demo Customer
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleDemoAdmin}>
              Fill Demo Admin
            </button>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            onClick={() => { onClose(); onOpenRegister(); }}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

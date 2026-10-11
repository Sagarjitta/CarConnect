import React, { useState } from 'react';
import { api, auth } from '../api';

export default function RegisterModal({ onClose, onSuccess, showToast }) {
  const [formData, setFormData] = useState({
    name: 'Jitta Sagar',
    email: '',
    password: '',
    contact: '9876543210',
    licenseNo: 'DL-1420110012345',
    address: 'Hyderabad, India'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.register(formData);
      auth.setToken(res.token);
      auth.setUser({
        id: res.id,
        username: res.username,
        email: res.email,
        role: res.role
      });

      showToast('Registration successful! You are now logged in.', 'success');
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
          <h3 className="dialog-title">Customer Registration</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jitta Sagar"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="sagar@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              placeholder="Min 6 characters"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                name="contact"
                className="form-control"
                value={formData.contact}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Driving License No.</label>
              <input
                type="text"
                name="licenseNo"
                className="form-control"
                value={formData.licenseNo}
                onChange={handleChange}
                placeholder="DL-1420110012345"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              placeholder="Hyderabad, India"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

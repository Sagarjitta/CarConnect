import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Users, Car, CalendarCheck, DollarSign, ShieldAlert, CheckCircle, XCircle, Trash2, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AdminDashboard({ showToast }) {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, carsData, bookingsData] = await Promise.all([
        api.admin.getDashboard(),
        api.admin.getUsers(),
        api.admin.getCars(),
        api.admin.getBookings()
      ]);
      setStats(statsData);
      setUsers(usersData || []);
      setCars(carsData || []);
      setBookings(bookingsData || []);
    } catch (err) {
      showToast('Could not load administrative telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleUserStatusToggle = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.admin.updateUserStatus(userId, nextStatus);
      showToast(`User status updated to ${nextStatus}`, 'success');
      loadDashboard();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete user account: ${name}?`)) return;
    try {
      await api.admin.deleteUser(userId);
      showToast('User account removed', 'success');
      loadDashboard();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCarStatusToggle = async (carId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.admin.updateCarStatus(carId, nextStatus);
      showToast(`Car status updated to ${nextStatus}`, 'success');
      loadDashboard();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCar = async (carId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete car listing: ${name}?`)) return;
    try {
      await api.admin.deleteCar(carId);
      showToast('Car listing deleted from platform', 'success');
      loadDashboard();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      await api.admin.updateBookingStatus(bookingId, newStatus);
      showToast(`Booking #${bookingId} status overridden to ${newStatus}`, 'success');
      loadDashboard();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Filter lists based on search query
  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCars = cars.filter(c =>
    c.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.owner?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(b =>
    b.id?.toString().includes(searchQuery) ||
    b.customer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.car?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.car?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ShieldCheck size={28} color="var(--accent-blue)" />
            <h1 style={{ fontSize: '2rem', margin: 0 }}>System Administration</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Platform moderation, user management, inventory verification, and booking controls.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={loadDashboard} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Telemetry
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>REGISTERED USERS</span>
            <Users size={18} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalUsers || users.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {stats?.totalCustomers || 0} Customers · {stats?.totalOwners || 0} Hosts
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>FLEET LISTINGS</span>
            <Car size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalCars || cars.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {stats?.activeCars || 0} Active on Marketplace
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>PLATFORM BOOKINGS</span>
            <CalendarCheck size={18} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalBookings || bookings.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {stats?.pendingBookings || 0} Pending · {stats?.confirmedBookings || 0} Confirmed
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>GROSS RENTAL REVENUE</span>
            <DollarSign size={18} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
            ₹{stats?.totalRevenue ? Number(stats.totalRevenue).toLocaleString() : '0'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {stats?.completedBookings || 0} Completed Trips
          </div>
        </div>
      </div>

      {/* Tabs and Search bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
          >
            <Users size={14} /> Users Moderation ({users.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'cars' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('cars'); setSearchQuery(''); }}
          >
            <Car size={14} /> Cars Moderation ({cars.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('bookings'); setSearchQuery(''); }}
          >
            <CalendarCheck size={14} /> All Bookings ({bookings.length})
          </button>
        </div>

        <div style={{ width: '280px' }}>
          <input
            type="text"
            className="form-control"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content Tables */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {activeTab === 'users' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No registered users found matching query
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontFamily: 'monospace' }}>#{u.id}</td>
                      <td style={{ fontWeight: 600 }}>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td>
                        <span className={`badge ${
                          u.role === 'ROLE_ADMIN' ? 'badge-rejected' :
                          u.role === 'ROLE_CAR_OWNER' ? 'badge-confirmed' : 'badge-pending'
                        }`}>
                          {u.role?.replace('ROLE_', '')}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.status === 'ACTIVE' ? 'badge-confirmed' : 'badge-rejected'}`}>
                          {u.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-outline' : 'btn-primary'}`}
                            onClick={() => handleUserStatusToggle(u.id, u.status || 'ACTIVE')}
                            title={u.status === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                            onClick={() => handleDeleteUser(u.id, u.fullName)}
                            title="Delete User"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'cars' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Reg Number</th>
                  <th>Location</th>
                  <th>Host / Owner</th>
                  <th>Price / Day</th>
                  <th>Visibility</th>
                  <th>Admin Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No car listings found matching query
                    </td>
                  </tr>
                ) : (
                  filteredCars.map(c => {
                    const primaryImg = c.images?.find(i => i.isPrimary)?.imageUrl || c.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=300&q=80';
                    return (
                      <tr key={c.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={primaryImg}
                              alt={c.model}
                              style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <div>
                              <div style={{ fontWeight: 600 }}>{c.brand} {c.model}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.year} · {c.carType}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>{c.registrationNumber}</td>
                        <td>{c.city}</td>
                        <td>{c.owner?.fullName || c.owner?.email || 'Host'}</td>
                        <td style={{ fontWeight: 600 }}>₹{c.pricePerDay}</td>
                        <td>
                          <span className={`badge ${c.isPublished ? 'badge-confirmed' : 'badge-pending'}`}>
                            {c.isPublished ? 'PUBLISHED' : 'UNPUBLISHED'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${c.status === 'ACTIVE' ? 'badge-confirmed' : 'badge-rejected'}`}>
                            {c.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className={`btn btn-sm ${c.status === 'ACTIVE' ? 'btn-outline' : 'btn-primary'}`}
                              onClick={() => handleCarStatusToggle(c.id, c.status || 'ACTIVE')}
                            >
                              {c.status === 'ACTIVE' ? 'Suspend' : 'Approve'}
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                              onClick={() => handleDeleteCar(c.id, `${c.brand} ${c.model}`)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Car</th>
                  <th>Customer</th>
                  <th>Host</th>
                  <th>Dates</th>
                  <th>Total Fare</th>
                  <th>Status</th>
                  <th>Override Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No booking transactions found matching query
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>#{b.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.car?.brand} {b.car?.model}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.car?.registrationNumber}</div>
                      </td>
                      <td>
                        <div>{b.customer?.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customer?.email}</div>
                      </td>
                      <td>{b.car?.owner?.fullName || 'Host'}</td>
                      <td style={{ fontSize: '0.85rem' }}>
                        <div>{b.startDate}</div>
                        <div style={{ color: 'var(--text-muted)' }}>to {b.endDate}</div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>
                        ₹{b.totalPrice?.toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge ${
                          b.status === 'CONFIRMED' ? 'badge-confirmed' :
                          b.status === 'COMPLETED' ? 'badge-confirmed' :
                          b.status === 'PENDING' ? 'badge-pending' : 'badge-rejected'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control form-control-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: '130px' }}
                          value={b.status}
                          onChange={(e) => handleBookingStatusChange(b.id, e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="REJECTED">REJECTED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

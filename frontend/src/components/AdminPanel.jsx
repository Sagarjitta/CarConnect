import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { RefreshCw, Plus, Users, Car, ClipboardList } from 'lucide-react';

export default function AdminPanel({ showToast, onCatalogChange }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Forms State
  const [companyName, setCompanyName] = useState('');
  const [variantForm, setVariantForm] = useState({
    companyId: '',
    name: '',
    fuel: 'Petrol',
    seats: 5,
    year: 2024,
    pricePerDay: 2500,
    ac: true
  });
  const [vehicleUnitForm, setVehicleUnitForm] = useState({
    variantId: '',
    regNumber: '',
    status: 'AVAILABLE'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'bookings') {
        const data = await api.bookings.getAllBookings();
        setBookings(data || []);
      } else if (activeTab === 'inventory') {
        const data = await api.catalog.getVehicles();
        setVehicles(data || []);
      } else if (activeTab === 'customers') {
        const data = await api.admin.getCustomers();
        setCustomers(data || []);
      } else if (activeTab === 'add-fleet') {
        const [cList, vList] = await Promise.all([
          api.catalog.getCompanies(),
          api.catalog.getVariants()
        ]);
        setCompanies(cList || []);
        setVariants(vList || []);
        if (cList?.length > 0 && !variantForm.companyId) {
          setVariantForm(prev => ({ ...prev, companyId: cList[0].id }));
        }
        if (vList?.length > 0 && !vehicleUnitForm.variantId) {
          setVehicleUnitForm(prev => ({ ...prev, variantId: vList[0].id }));
        }
      }
    } catch (err) {
      showToast('Failed to load admin telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleStatusChange = async (bookingId, status) => {
    if (!status) return;
    try {
      await api.bookings.updateStatus(bookingId, status);
      showToast(`Booking #${bookingId} updated to ${status}`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleVehicleStatusChange = async (unitId, status) => {
    if (!status) return;
    try {
      await api.admin.updateVehicleStatus(unitId, status);
      showToast(`Unit #${unitId} updated to ${status}`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createCompany({ name: companyName.trim() });
      showToast(`Company '${companyName}' added!`, 'success');
      setCompanyName('');
      loadData();
      if (onCatalogChange) onCatalogChange();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddVariant = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createVariant(variantForm.companyId, {
        name: variantForm.name,
        fuel: variantForm.fuel,
        seats: Number(variantForm.seats),
        year: Number(variantForm.year),
        pricePerDay: Number(variantForm.pricePerDay),
        ac: variantForm.ac
      });
      showToast(`Variant '${variantForm.name}' created!`, 'success');
      setVariantForm(prev => ({ ...prev, name: '' }));
      loadData();
      if (onCatalogChange) onCatalogChange();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddVehicleUnit = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createVehicle(vehicleUnitForm.variantId, {
        regNumber: vehicleUnitForm.regNumber.trim().toUpperCase(),
        status: vehicleUnitForm.status
      });
      showToast(`Unit '${vehicleUnitForm.regNumber}' registered!`, 'success');
      setVehicleUnitForm(prev => ({ ...prev, regNumber: '' }));
      loadData();
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
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <ClipboardList size={16} /> Platform Bookings
        </button>
        <button
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Car size={16} /> Fleet Inventory
        </button>
        <button
          className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <Users size={16} /> Customer Records
        </button>
        <button
          className={`tab-btn ${activeTab === 'add-fleet' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-fleet')}
        >
          <Plus size={16} /> Add Fleet & Units
        </button>
      </div>

      {/* Tab 1: Bookings */}
      {activeTab === 'bookings' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3>All Reservations Across Platform</h3>
            <button className="btn btn-secondary btn-sm" onClick={loadData}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Vehicle Model</th>
                  <th>Registration</th>
                  <th>Dates</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading bookings...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings registered yet.</td></tr>
                ) : (
                  bookings.map(b => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td>
                        <strong>{b.customer?.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.customer?.email}</div>
                      </td>
                      <td>{b.vehicle?.variant?.name}</td>
                      <td><code>{b.vehicle?.regNumber}</code></td>
                      <td>{b.fromDate} &rarr; {b.toDate}</td>
                      <td><strong>₹{b.totalPrice?.toLocaleString()}</strong></td>
                      <td>
                        <span className={`badge ${getBadgeClass(b.status)}`}>
                          {b.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Update...</option>
                          <option value="APPROVED">Approve</option>
                          <option value="PAID_AND_CONFIRMED">Mark Paid</option>
                          <option value="COMPLETED">Complete</option>
                          <option value="CANCELLED">Cancel</option>
                          <option value="DEACTIVATED">Deactivate</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory */}
      {activeTab === 'inventory' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3>Physical Units & Availability</h3>
            <button className="btn btn-secondary btn-sm" onClick={loadData}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Unit ID</th>
                  <th>Model Variant</th>
                  <th>Manufacturer</th>
                  <th>Registration No</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading units...</td></tr>
                ) : (
                  vehicles.map(v => (
                    <tr key={v.id}>
                      <td>#{v.id}</td>
                      <td><strong>{v.variant?.name}</strong></td>
                      <td>{v.variant?.company?.name}</td>
                      <td><code>{v.regNumber}</code></td>
                      <td>
                        <span className={`badge ${v.status === 'AVAILABLE' ? 'badge-available' : 'badge-booked'}`}>
                          {v.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                          onChange={(e) => handleVehicleStatusChange(v.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Status...</option>
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="MAINTENANCE">MAINTENANCE</option>
                          <option value="DEACTIVATED">DEACTIVATED</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Customers */}
      {activeTab === 'customers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3>Verified Customer Records</h3>
            <button className="btn btn-secondary btn-sm" onClick={loadData}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Contact</th>
                  <th>Address</th>
                  <th>Driving License Number</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading customers...</td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No customers registered yet.</td></tr>
                ) : (
                  customers.map(c => (
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.email}</td>
                      <td>{c.contact || 'N/A'}</td>
                      <td>{c.address || 'N/A'}</td>
                      <td><code style={{ color: 'var(--accent)', fontWeight: 700 }}>{c.licenseNo}</code></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Add Fleet Forms */}
      {activeTab === 'add-fleet' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Add Company */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: '1rem' }}>1. Add Brand / Company</h4>
            <form onSubmit={handleAddCompany}>
              <div className="form-group">
                <label className="form-label">Brand Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. BMW"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Company</button>
            </form>
          </div>

          {/* Add Variant */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: '1rem' }}>2. Add Model Specification</h4>
            <form onSubmit={handleAddVariant}>
              <div className="form-group">
                <label className="form-label">Company</label>
                <select
                  className="form-control"
                  value={variantForm.companyId}
                  onChange={(e) => setVariantForm({ ...variantForm, companyId: e.target.value })}
                  required
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Model Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={variantForm.name}
                  onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
                  placeholder="e.g. X5 M-Sport"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Fuel</label>
                  <select
                    className="form-control"
                    value={variantForm.fuel}
                    onChange={(e) => setVariantForm({ ...variantForm, fuel: e.target.value })}
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Seats</label>
                  <input
                    type="number"
                    className="form-control"
                    value={variantForm.seats}
                    onChange={(e) => setVariantForm({ ...variantForm, seats: e.target.value })}
                    min="2"
                    max="10"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Year</label>
                  <input
                    type="number"
                    className="form-control"
                    value={variantForm.year}
                    onChange={(e) => setVariantForm({ ...variantForm, year: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Price / Day (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={variantForm.pricePerDay}
                    onChange={(e) => setVariantForm({ ...variantForm, pricePerDay: e.target.value })}
                    step="50"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Variant</button>
            </form>
          </div>

          {/* Add Vehicle Unit */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: '1rem' }}>3. Register Physical Unit</h4>
            <form onSubmit={handleAddVehicleUnit}>
              <div className="form-group">
                <label className="form-label">Select Variant</label>
                <select
                  className="form-control"
                  value={vehicleUnitForm.variantId}
                  onChange={(e) => setVehicleUnitForm({ ...vehicleUnitForm, variantId: e.target.value })}
                  required
                >
                  {variants.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.company?.name})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Registration Plate Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={vehicleUnitForm.regNumber}
                  onChange={(e) => setVehicleUnitForm({ ...vehicleUnitForm, regNumber: e.target.value })}
                  placeholder="e.g. TS-09-AB-1234"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={vehicleUnitForm.status}
                  onChange={(e) => setVehicleUnitForm({ ...vehicleUnitForm, status: e.target.value })}
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register Vehicle</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

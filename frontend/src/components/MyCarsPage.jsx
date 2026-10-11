import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, Car } from 'lucide-react';
import AddEditCarModal from './AddEditCarModal';

export default function MyCarsPage({ onAddCarClick, showToast }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await api.owner.getMyCars();
      setCars(data || []);
    } catch (err) {
      showToast('Could not load your cars', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleTogglePublish = async (id) => {
    try {
      const updated = await api.owner.togglePublish(id);
      showToast(`Listing ${updated.isPublished ? 'published' : 'unpublished'}!`, 'info');
      fetchCars();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from your listings?`)) return;
    try {
      await api.owner.deleteCar(id);
      showToast(`Vehicle listing deleted successfully`, 'success');
      fetchCars();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>My Vehicle Fleet</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your car listings, availability, and rental pricing.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchCars}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={onAddCarClick}>
            <Plus size={16} /> Add New Car Listing
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Reg Plate</th>
              <th>Type / Fuel</th>
              <th>Location</th>
              <th>Daily Rate</th>
              <th>Visibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading vehicle listings...
                </td>
              </tr>
            ) : cars.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚗</div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>No Cars Listed Yet</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Start earning passive income by listing your first car on CarConnect.
                  </p>
                  <button className="btn btn-primary btn-sm" onClick={onAddCarClick}>
                    List Your First Car
                  </button>
                </td>
              </tr>
            ) : (
              cars.map(c => {
                const img = c.images?.find(i => i.isPrimary)?.imageUrl || c.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=150&q=80';
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img src={img} alt="" style={{ width: '60px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <strong>{c.brand} {c.model}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Year {c.year} &bull; {c.seats} Seats</div>
                        </div>
                      </div>
                    </td>
                    <td><code>{c.regNumber}</code></td>
                    <td>
                      <div>{c.carType}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.fuelType} &bull; {c.transmission}</div>
                    </td>
                    <td>{c.city}</td>
                    <td><strong style={{ color: 'var(--accent-cyan)' }}>₹{c.pricePerDay?.toLocaleString()}</strong></td>
                    <td>
                      <span className={`badge ${c.isPublished ? 'badge-confirmed' : 'badge-suspended'}`}>
                        {c.isPublished ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setEditingCar(c)}
                          title="Edit Details"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleTogglePublish(c.id)}
                          title={c.isPublished ? 'Unpublish from Search' : 'Publish to Search'}
                        >
                          {c.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(c.id, `${c.brand} ${c.model}`)}
                          title="Delete Listing"
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

      {/* Edit Modal */}
      {editingCar && (
        <AddEditCarModal
          car={editingCar}
          onClose={() => setEditingCar(null)}
          onSuccess={() => {
            setEditingCar(null);
            fetchCars();
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';

export default function AddEditCarModal({ car, onClose, onSuccess, showToast }) {
  const isEditing = !!car;

  const [brand, setBrand] = useState(car?.brand || '');
  const [model, setModel] = useState(car?.model || '');
  const [year, setYear] = useState(car?.year || 2024);
  const [regNumber, setRegNumber] = useState(car?.regNumber || '');
  const [carType, setCarType] = useState(car?.carType || 'Sedan');
  const [fuelType, setFuelType] = useState(car?.fuelType || 'Petrol');
  const [transmission, setTransmission] = useState(car?.transmission || 'Automatic');
  const [seats, setSeats] = useState(car?.seats || 5);
  const [pricePerDay, setPricePerDay] = useState(car?.pricePerDay || 3000);
  const [city, setCity] = useState(car?.city || 'Bengaluru');
  const [locationAddress, setLocationAddress] = useState(car?.locationAddress || '');
  const [description, setDescription] = useState(car?.description || '');
  const [features, setFeatures] = useState(car?.features || 'GPS, Sunroof, Bluetooth, 360 Camera, Heated Seats');
  const [imageUrls, setImageUrls] = useState(
    car?.images?.map(i => i.imageUrl) || [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80'
    ]
  );
  const [newImageInput, setNewImageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddImageUrl = () => {
    if (!newImageInput.trim()) return;
    setImageUrls(prev => [...prev, newImageInput.trim()]);
    setNewImageInput('');
  };

  const handleRemoveImage = (index) => {
    setImageUrls(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const payload = {
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      regNumber: regNumber.trim().toUpperCase(),
      carType,
      fuelType,
      transmission,
      seats: Number(seats),
      pricePerDay: Number(pricePerDay),
      city: city.trim(),
      locationAddress: locationAddress.trim(),
      description: description.trim(),
      features: features.trim(),
      isPublished: true,
      imageUrls: imageUrls.filter(Boolean)
    };

    try {
      if (isEditing) {
        await api.owner.updateCar(car.id, payload);
        showToast('Car listing updated successfully!', 'success');
      } else {
        await api.owner.createCar(payload);
        showToast('New car listed successfully!', 'success');
      }
      onSuccess();
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.4rem' }}>{isEditing ? 'Edit Vehicle Listing' : 'Add New Car to CarConnect Fleet'}</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Brand / Make</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. BMW, Tesla, Mahindra"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Model Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. M340i, Thar 4x4"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Manufacturing Year</label>
              <input
                type="number"
                className="form-control"
                min="1995"
                max="2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Registration Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. TS-09-AB-1234"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Car Type / Body Style</label>
              <select className="form-control" value={carType} onChange={(e) => setCarType(e.target.value)}>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Fuel Type</label>
              <select className="form-control" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Transmission</label>
              <select className="form-control" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Seating Capacity</label>
              <input
                type="number"
                className="form-control"
                min="2"
                max="9"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Price / Day (₹)</label>
              <input
                type="number"
                className="form-control"
                min="200"
                step="100"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Hyderabad, Bengaluru, Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1.5 }}>
              <label className="form-label">Specific Pickup Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Near Hitec City Metro Station"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Features (comma separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="GPS Navigation, Sunroof, 360 Camera, Bluetooth"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Host Guidelines</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Highlight condition, driving feel, highway readiness, or key host rules..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Car Photos Section */}
          <div className="form-group">
            <label className="form-label">Vehicle Photos (URLs)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="url"
                className="form-control"
                placeholder="Paste direct image URL (https://...)"
                value={newImageInput}
                onChange={(e) => setNewImageInput(e.target.value)}
              />
              <button type="button" className="btn btn-outline btn-sm" onClick={handleAddImageUrl}>
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Photos Preview */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {imageUrls.map((url, idx) => (
                <div key={idx} style={{ position: 'relative', width: '90px', height: '65px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.85)', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 4px', cursor: 'pointer' }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Saving Vehicle...' : isEditing ? 'Save Changes' : 'Publish Car Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

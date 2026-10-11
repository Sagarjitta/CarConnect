import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Fuel, Gauge, Users, Calendar, ShieldCheck, Star, CheckCircle, Share2 } from 'lucide-react';
import { api } from '../api';

export default function CarDetailsPage({ car, onBack, onBookCar, showToast }) {
  const [selectedImg, setSelectedImg] = useState(
    car.images?.find(i => i.isPrimary)?.imageUrl ||
    car.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
  );

  const [reviewsData, setReviewsData] = useState({ reviews: [], summary: { averageRating: 5.0, totalReviews: 0 } });
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Quick reservation estimator state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const future = new Date();
  future.setDate(future.getDate() + 4);
  const futureStr = future.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(tomorrowStr);
  const [endDate, setEndDate] = useState(futureStr);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const days = calculateDays();
  const totalPrice = days * (car.pricePerDay || 0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.reviews.getCarReviews(car.id);
        if (data) setReviewsData(data);
      } catch (err) {
        // reviews are optional
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [car.id]);

  const featuresList = car.features
    ? car.features.split(',').map(f => f.trim()).filter(Boolean)
    : ['GPS Navigation', 'Bluetooth Audio', 'Air Conditioning', 'Power Windows'];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <button className="btn btn-outline btn-sm" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={14} /> Back to Browse
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '2.5rem' }}>
        {/* Left Column: Photos & Details */}
        <div>
          {/* Main Photo */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '420px', background: '#0B1530', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <img src={selectedImg} alt={car.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Thumbnails Gallery */}
          {car.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {car.images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  onClick={() => setSelectedImg(img.imageUrl)}
                  style={{
                    width: '100px',
                    height: '70px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImg === img.imageUrl ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                    opacity: selectedImg === img.imageUrl ? 1 : 0.65,
                    flexShrink: 0
                  }}
                >
                  <img src={img.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Title & Metadata */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-confirmed" style={{ marginBottom: '0.5rem' }}>{car.carType}</span>
                <h1 style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}>{car.brand} {car.model}</h1>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={15} color="var(--accent-blue)" /> {car.locationAddress ? `${car.locationAddress}, ` : ''}{car.city} &bull; Reg: <code style={{ color: 'var(--accent-cyan)' }}>{car.regNumber}</code>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#FBBF24', fontSize: '1.1rem', fontWeight: 700 }}>
                  <Star size={18} fill="#FBBF24" /> {reviewsData.summary?.averageRating || 5.0}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ({reviewsData.summary?.totalReviews || 0} reviews)
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Vehicle Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fuel</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{car.fuelType}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transmission</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{car.transmission}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seating</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{car.seats} Persons</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mfg Year</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{car.year}</div>
              </div>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Included Features & Amenities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {featuresList.map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <CheckCircle size={15} color="var(--accent-emerald)" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Host Description</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {car.description}
              </p>
            </div>
          )}

          {/* Host Card */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Hosted By</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={car.owner?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                alt=""
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {car.owner?.fullName || 'Verified CarConnect Host'}
                  <ShieldCheck size={16} color="var(--accent-blue)" />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Location: {car.owner?.city || car.city} &bull; Identity & Registration Verified
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Customer Feedback & Reviews</h3>
            {loadingReviews ? (
              <div style={{ color: 'var(--text-muted)' }}>Loading reviews...</div>
            ) : reviewsData.reviews?.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No reviews recorded yet for this vehicle. Be the first to rent and leave feedback!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviewsData.reviews.map(r => (
                  <div key={r.id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{r.customer?.fullName || 'Traveler'}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#FBBF24', fontSize: '0.85rem' }}>
                        <Star size={13} fill="#FBBF24" /> {r.rating} / 5
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '100px', border: '1px solid var(--accent-blue)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  ₹{car.pricePerDay?.toLocaleString()}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / day</span>
              </div>
              <span className="badge badge-confirmed">Available</span>
            </div>

            {/* Date Picker Form */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Pick-up Date</label>
                <input
                  type="date"
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Drop-off / Return Date</label>
                <input
                  type="date"
                  className="form-control"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Price Breakdown */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>₹{car.pricePerDay?.toLocaleString()} &times; {days} day{days > 1 ? 's' : ''}</span>
                <span>₹{(days * car.pricePerDay)?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Platform Protection Fee</span>
                <span>₹250</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}>
                <span>Estimated Total</span>
                <span style={{ color: 'var(--accent-cyan)' }}>₹{(totalPrice + 250)?.toLocaleString()}</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
              onClick={() => onBookCar(car, { startDate, endDate, days, totalPrice: totalPrice + 250 })}
            >
              Proceed to Booking Checkout
            </button>

            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              🔒 Protected by CarConnect host guarantee &bull; Free cancellation up to 24 hrs prior
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

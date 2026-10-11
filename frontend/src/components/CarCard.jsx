import React from 'react';
import { Fuel, Users, Gauge, MapPin, Calendar, Star } from 'lucide-react';

export default function CarCard({ car, onSelectCar, onBookCar }) {
  const primaryImage = car.images?.find(i => i.isPrimary)?.imageUrl ||
                       car.images?.[0]?.imageUrl ||
                       'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="car-item-card">
      <div className="car-img-wrapper" onClick={() => onSelectCar(car)} style={{ cursor: 'pointer' }}>
        <img src={primaryImage} alt={`${car.brand} ${car.model}`} loading="lazy" />
        <span className="car-type-pill">{car.carType}</span>
        <span className="car-city-pill">
          <MapPin size={12} style={{ display: 'inline', marginRight: '2px' }} />
          {car.city}
        </span>
      </div>

      <div className="car-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
          <div>
            <h3 className="car-card-title" onClick={() => onSelectCar(car)} style={{ cursor: 'pointer' }}>
              {car.brand} {car.model}
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Host: {car.owner?.fullName || 'Verified Host'} &bull; Year {car.year}
            </div>
          </div>
        </div>

        <div className="car-card-specs">
          <div className="car-spec-item" title="Fuel Type">
            <Fuel size={13} color="var(--accent-cyan)" />
            <span>{car.fuelType}</span>
          </div>
          <div className="car-spec-item" title="Transmission">
            <Gauge size={13} color="var(--accent-cyan)" />
            <span>{car.transmission}</span>
          </div>
          <div className="car-spec-item" title="Seating Capacity">
            <Users size={13} color="var(--accent-cyan)" />
            <span>{car.seats} Seats</span>
          </div>
        </div>

        <div className="car-card-footer">
          <div>
            <span className="car-price-tag">₹{car.pricePerDay?.toLocaleString()}</span>
            <span className="car-price-unit"> / day</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onSelectCar(car)}
            >
              Details
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onBookCar(car)}
            >
              Rent Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

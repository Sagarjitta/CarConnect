import React, { useState } from 'react';
import { Search, MapPin, Calendar, Car, Shield, Award, Sparkles, Key, DollarSign, ChevronRight } from 'lucide-react';
import CarCard from './CarCard';

export default function HomePage({ cars, onSelectCar, onBookCar, onSearchSubmit, onCategorySelect, setView }) {
  const [city, setCity] = useState('');
  const [carType, setCarType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearchSubmit({ city, carType, startDate, endDate });
  };

  const categories = [
    { name: 'SUV', icon: '🚙', desc: 'Rugged capability & road trips' },
    { name: 'Sedan', icon: '🚗', desc: 'Comfort & executive elegance' },
    { name: 'Luxury', icon: '🏎️', desc: 'Exotic performance & prestige' },
    { name: 'Electric', icon: '⚡', desc: 'Clean energy & instant torque' },
  ];

  const featuredCars = cars.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: '9999px', padding: '0.4rem 1rem', fontSize: '0.85rem', color: '#60A5FA', marginBottom: '1.25rem', fontWeight: 600 }}>
            <Sparkles size={16} /> India's Leading Peer-to-Peer Car Sharing Marketplace
          </div>

          <h1 className="hero-title">
            Rent Exceptional Cars from <span className="hero-highlight">Trusted Local Hosts</span>
          </h1>

          <p className="hero-sub">
            Skip the traditional counter lines. Book verified private vehicles directly from verified car owners for weekend road trips, business travels, and unforgettable driving experiences.
          </p>

          {/* Quick Search Widget */}
          <form className="search-box-card" onSubmit={handleSearch}>
            <div>
              <label className="form-label">
                <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} /> Pick-up Location / City
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Hyderabad, Bengaluru, Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">
                <Car size={13} style={{ display: 'inline', marginRight: '4px' }} /> Vehicle Type
              </label>
              <select
                className="form-control"
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
              >
                <option value="">All Body Styles</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Pick-up Date
              </label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">
                <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Return Date
              </label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>
              <Search size={16} /> Search Cars
            </button>
          </form>
        </div>
      </section>

      {/* Popular Categories */}
      <section style={{ padding: '3.5rem 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Browse by Vehicle Category</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Select your preferred category to quickly discover available rides.</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setView('browse')}>
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {categories.map(cat => (
              <div
                key={cat.name}
                className="card"
                onClick={() => onCategorySelect(cat.name)}
                style={{ cursor: 'pointer', textAlign: 'center', padding: '1.75rem 1rem' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{cat.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Featured Verified Vehicles</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Handpicked listings with top host ratings and instant booking confirmation.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setView('browse')}>
              Explore Fleet ({cars.length} Cars)
            </button>
          </div>

          <div className="car-grid">
            {featuredCars.map(car => (
              <CarCard
                key={car.id}
                car={car}
                onSelectCar={onSelectCar}
                onBookCar={onBookCar}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How P2P Works */}
      <section style={{ padding: '4.5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>How CarConnect Works</h2>
            <p style={{ color: 'var(--text-muted)' }}>Simple, secure peer-to-peer car sharing designed for both travelers and vehicle owners.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(37,99,235,0.15)', color: 'var(--accent-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Search size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>1. Find Your Ideal Car</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter your trip dates and city to browse hundreds of cars from sedans to electric SUVs.</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(16,185,129,0.15)', color: 'var(--accent-emerald)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Key size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>2. Book & Connect with Host</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Submit a booking request. The host approves your dates, and you complete simulated checkout.</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(6,182,212,0.15)', color: 'var(--accent-cyan)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Car size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>3. Pick-up and Drive</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pick up the keys at the verified location or airport, hit the road, and review your host afterwards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Host CTA Banner */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #101F42 0%, #17326E 100%)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Have a Car Standing Idle? Earn with CarConnect</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', fontSize: '1.05rem', marginBottom: '2rem' }}>
              Join thousands of car owners earning ₹30,000 to ₹80,000 every month. Set your own prices, choose available dates, and accept requests on your schedule.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => setView('owner-dashboard')}>
              <DollarSign size={18} /> Start Hosting Your Car
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

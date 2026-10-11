import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw, MapPin, SlidersHorizontal } from 'lucide-react';
import CarCard from './CarCard';

export default function BrowseCarsPage({ cars, onSelectCar, onBookCar, initialFilter = {} }) {
  const [searchQuery, setSearchQuery] = useState(initialFilter.searchQuery || '');
  const [cityFilter, setCityFilter] = useState(initialFilter.city || '');
  const [carTypeFilter, setCarTypeFilter] = useState(initialFilter.carType || '');
  const [fuelFilter, setFuelFilter] = useState(initialFilter.fuelType || '');
  const [transFilter, setTransFilter] = useState(initialFilter.transmission || '');
  const [seatsFilter, setSeatsFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(25000);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    if (initialFilter.carType) setCarTypeFilter(initialFilter.carType);
    if (initialFilter.city) setCityFilter(initialFilter.city);
  }, [initialFilter]);

  const handleReset = () => {
    setSearchQuery('');
    setCityFilter('');
    setCarTypeFilter('');
    setFuelFilter('');
    setTransFilter('');
    setSeatsFilter('');
    setMaxPrice(25000);
    setSortBy('featured');
  };

  const filteredCars = cars.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQ = !q || c.brand.toLowerCase().includes(q) || c.model.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
    const matchesCity = !cityFilter || c.city.toLowerCase().includes(cityFilter.toLowerCase().trim());
    const matchesType = !carTypeFilter || c.carType.toLowerCase() === carTypeFilter.toLowerCase();
    const matchesFuel = !fuelFilter || c.fuelType.toLowerCase() === fuelFilter.toLowerCase();
    const matchesTrans = !transFilter || c.transmission.toLowerCase() === transFilter.toLowerCase();
    const matchesSeats = !seatsFilter || c.seats >= Number(seatsFilter);
    const matchesPrice = !maxPrice || c.pricePerDay <= Number(maxPrice);

    return matchesQ && matchesCity && matchesType && matchesFuel && matchesTrans && matchesSeats && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
    if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
    if (sortBy === 'year-desc') return b.year - a.year;
    return 0;
  });

  const citiesList = Array.from(new Set(cars.map(c => c.city).filter(Boolean)));

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Browse Vehicle Fleet</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Discover available cars for rent across major cities with full specifications and live availability.
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Search Model or Brand</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. BMW, Thar, Tesla..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">City</label>
            <select
              className="form-control"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {citiesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Car Type</label>
            <select
              className="form-control"
              value={carTypeFilter}
              onChange={(e) => setCarTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Luxury">Luxury</option>
              <option value="Hatchback">Hatchback</option>
            </select>
          </div>

          <div>
            <label className="form-label">Fuel Type</label>
            <select
              className="form-control"
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
            >
              <option value="">All Fuel</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="form-label">Transmission</label>
            <select
              className="form-control"
              value={transFilter}
              onChange={(e) => setTransFilter(e.target.value)}
            >
              <option value="">All Transmissions</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="form-label">Max Price: ₹{maxPrice?.toLocaleString()}</label>
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label className="form-label">Sort By</label>
            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured / Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest First</option>
            </select>
          </div>

          <div>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleReset}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-main)' }}>{filteredCars.length}</strong> available vehicle{filteredCars.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Car Grid */}
      {filteredCars.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Vehicles Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            No vehicles currently match your selected filters. Try broadening your location or price range.
          </p>
          <button className="btn btn-primary btn-sm" onClick={handleReset}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="car-grid">
          {filteredCars.map(car => (
            <CarCard
              key={car.id}
              car={car}
              onSelectCar={onSelectCar}
              onBookCar={onBookCar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

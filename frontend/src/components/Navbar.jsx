import React from 'react';
import { Car, User, LogOut, Shield, KeyRound, CalendarCheck, PlusCircle, LayoutDashboard, HelpCircle } from 'lucide-react';
import { auth } from '../api';

export default function Navbar({ currentView, setView, user, onLoginClick, onRegisterClick, onLogout }) {
  const isOwner = user && (user.role === 'ROLE_CAR_OWNER' || user.role === 'CAR_OWNER');
  const isAdmin = user && (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN');
  const isCustomer = user && (user.role === 'ROLE_CUSTOMER' || user.role === 'CUSTOMER');

  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => setView('home')}>
        <div className="nav-logo-icon">
          <Car size={22} />
        </div>
        <div>
          <span>Car<span style={{ color: 'var(--accent-cyan)' }}>Connect</span></span>
          <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            PEER-TO-PEER RENTALS
          </span>
        </div>
      </div>

      <nav>
        <ul className="nav-links">
          <li>
            <button
              className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => setView('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentView === 'browse' ? 'active' : ''}`}
              onClick={() => setView('browse')}
            >
              Browse Cars
            </button>
          </li>

          {/* Customer Specific Links */}
          {user && isCustomer && (
            <>
              <li>
                <button
                  className={`nav-link ${currentView === 'customer-dashboard' ? 'active' : ''}`}
                  onClick={() => setView('customer-dashboard')}
                >
                  <LayoutDashboard size={15} style={{ display: 'inline', marginRight: '4px' }} /> Dashboard
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentView === 'my-bookings' ? 'active' : ''}`}
                  onClick={() => setView('my-bookings')}
                >
                  <CalendarCheck size={15} style={{ display: 'inline', marginRight: '4px' }} /> My Trips
                </button>
              </li>
            </>
          )}

          {/* Owner Specific Links */}
          {user && isOwner && (
            <>
              <li>
                <button
                  className={`nav-link ${currentView === 'owner-dashboard' ? 'active' : ''}`}
                  onClick={() => setView('owner-dashboard')}
                >
                  <LayoutDashboard size={15} style={{ display: 'inline', marginRight: '4px' }} /> Host Portal
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentView === 'my-cars' ? 'active' : ''}`}
                  onClick={() => setView('my-cars')}
                >
                  <Car size={15} style={{ display: 'inline', marginRight: '4px' }} /> My Listings
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentView === 'owner-bookings' ? 'active' : ''}`}
                  onClick={() => setView('owner-bookings')}
                >
                  <CalendarCheck size={15} style={{ display: 'inline', marginRight: '4px' }} /> Rental Requests
                </button>
              </li>
            </>
          )}

          {/* Admin Link */}
          {isAdmin && (
            <li>
              <button
                className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => setView('admin')}
              >
                <Shield size={15} style={{ display: 'inline', marginRight: '4px' }} /> Admin Panel
              </button>
            </li>
          )}

          <li>
            <button
              className={`nav-link ${currentView === 'about' ? 'active' : ''}`}
              onClick={() => setView('about')}
            >
              About
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentView === 'contact' ? 'active' : ''}`}
              onClick={() => setView('contact')}
            >
              Contact
            </button>
          </li>
        </ul>
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setView('profile')}
              title="View Profile"
            >
              {isAdmin ? (
                <Shield size={15} color="#60A5FA" />
              ) : isOwner ? (
                <KeyRound size={15} color="#34D399" />
              ) : (
                <User size={15} color="#38BDF8" />
              )}
              <span>{user.fullName || user.email}</span>
            </button>
            <button className="btn btn-outline btn-sm" onClick={onLogout} title="Sign Out">
              <LogOut size={15} />
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-outline btn-sm" onClick={onLoginClick}>
              Sign In
            </button>
            <button className="btn btn-primary btn-sm" onClick={onRegisterClick}>
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}

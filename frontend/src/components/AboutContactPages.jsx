import React, { useState } from 'react';
import { Shield, Award, Users, Car, HeartHandshake, Phone, Mail, MapPin, Send, HelpCircle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export function AboutPage({ setView, onRegisterClick }) {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="badge badge-confirmed" style={{ marginBottom: '1rem' }}>ABOUT CARCONNECT</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
          Redefining Automotive Mobility with <span style={{ color: 'var(--accent-blue)' }}>Peer-to-Peer Car Sharing</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
          CarConnect is India's premier community-driven mobility ecosystem, connecting responsible drivers with local car owners who have extraordinary vehicles to share.
        </p>
      </div>

      {/* Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Shield size={24} color="var(--accent-blue)" />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Trust & Safety First</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
            Every host and traveler undergoes rigorous KYC and driving record verification. Every booking is backed by comprehensive protection.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Car size={24} color="#34D399" />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Curated Diverse Fleet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
            From high-efficiency city hatchbacks and executive sedans to rugged 4x4 SUVs and exotic luxury coupés, find the exact car you need.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <HeartHandshake size={24} color="#FBBF24" />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Empowering Local Hosts</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
            Vehicle owners transform their parked cars into productive income streams, paying off EMIs while contributing to sustainable shared transport.
          </p>
        </div>
      </div>

      {/* How it Works Comparison */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem' }}>How CarConnect Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '1.5rem' }}>
            <h3 style={{ color: 'var(--accent-blue)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>For Travelers</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <strong>1. Discover Cars:</strong> Filter by location, price, fuel type, seats, and dates.
              </div>
              <div>
                <strong>2. Request & Reserve:</strong> Review specs, total pricing, and submit your reservation request.
              </div>
              <div>
                <strong>3. Key Handover & Drive:</strong> Meet host, verify vehicle condition, and enjoy your journey!
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ color: '#34D399', fontSize: '1.2rem', marginBottom: '1.25rem' }}>For Car Hosts</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <strong>1. List Vehicle:</strong> Upload photos, set daily price, availability, and description.
              </div>
              <div>
                <strong>2. Accept Requests:</strong> Review renter profiles and accept booking requests that suit your schedule.
              </div>
              <div>
                <strong>3. Earn Seamlessly:</strong> Get direct payouts for completed rentals with full earnings analytics.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Host CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #101F42 0%, #1E3A8A 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Ready to monetize your parked vehicle?</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Join thousands of host entrepreneurs earning up to ₹40,000/month by sharing their cars on CarConnect.
        </p>
        <button className="btn btn-primary" onClick={onRegisterClick}>
          Become a Host Today
        </button>
      </div>
    </div>
  );
}

export function ContactPage({ showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Inquiry received! Our concierge team will reach out within 2 hours.', 'success');
  };

  const faqs = [
    {
      q: 'What are the eligibility criteria to rent a car on CarConnect?',
      a: 'Travelers must be at least 21 years old, possess a valid government-issued Driving License with minimum 1 year of driving history, and complete our digital KYC verification.'
    },
    {
      q: 'What is the cancellation policy for bookings?',
      a: 'Bookings cancelled at least 24 hours prior to the scheduled pick-up time receive a 100% full refund. Cancellations within 24 hours incur a nominal 1-day rental deduction to compensate the host.'
    },
    {
      q: 'What happens if a vehicle experiences a breakdown or mechanical issue?',
      a: 'CarConnect provides round-the-clock 24/7 Roadside Assistance across national highways and urban corridors. Call our emergency helpline to dispatch support or arrange an alternate vehicle.'
    },
    {
      q: 'How do hosts get paid for completed bookings?',
      a: 'Host earnings are calculated automatically after each completed rental and deposited directly into the registered host bank account via NEFT/UPI within 24-48 business hours.'
    }
  ];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge badge-confirmed" style={{ marginBottom: '1rem' }}>CONCIERGE & SUPPORT</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          We're Here to Help, 24/7
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
          Have a question about a reservation, interested in enterprise hosting, or need roadside assistance? Reach out to our customer care team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        {/* Contact Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Send Us a Message</h2>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <CheckCircle2 size={48} color="#34D399" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Thank You for Reaching Out!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Your message has been assigned Ticket #{Math.floor(100000 + Math.random() * 900000)}. Our concierge team will reply via {formData.email}.
              </p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={() => setSubmitted(false)}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Subject</label>
                <select
                  className="form-control"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Booking Support">Booking Support</option>
                  <option value="Host Onboarding">Host Onboarding & Fleet</option>
                  <option value="Roadside Emergency">Roadside Emergency</option>
                  <option value="Feedback">Feedback / Suggestions</option>
                </select>
              </div>

              <div>
                <label className="form-label">Message *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="How can our concierge team assist you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Send size={15} /> Submit Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Contact Coordinates & Info */}
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Contact Information</h3>

            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} color="var(--accent-blue)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Headquarters</div>
                  <div style={{ fontWeight: 600 }}>CarConnect Mobility Hub</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>HITEC City, Hyderabad, Telangana 500081</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={20} color="#34D399" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>24/7 Concierge Hotline</div>
                  <div style={{ fontWeight: 600 }}>+91 (040) 4567 8900</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Toll-Free Emergency: 1800-419-CARS</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={20} color="#FBBF24" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customer Support Email</div>
                  <div style={{ fontWeight: 600 }}>support@carconnect.in</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Host Inquiries: hosts@carconnect.in</div>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Hours */}
          <div className="card" style={{ padding: '1.75rem', background: 'rgba(37, 99, 235, 0.04)' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#60A5FA', marginBottom: '0.5rem' }}>Operating Hours</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              <div>• Booking & Reservations: <strong>24/7 Digital Platform</strong></div>
              <div>• Roadside Assistance: <strong>24/7/365 On-Call Dispatch</strong></div>
              <div>• Host Verification & Onboarding: <strong>Mon - Sat (9:00 AM - 7:00 PM IST)</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div>
        <h2 style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <HelpCircle size={22} color="var(--accent-blue)" /> Frequently Asked Questions
        </h2>

        <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '850px', margin: '0 auto' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="card" style={{ padding: '1.25rem', cursor: 'pointer' }} onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem' }}>{faq.q}</strong>
                {activeFaq === idx ? <ChevronUp size={18} color="var(--accent-blue)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
              </div>
              {activeFaq === idx && (
                <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: '0.75rem 0 0' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

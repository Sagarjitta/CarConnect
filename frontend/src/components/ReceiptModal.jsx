import React from 'react';
import { CheckCircle2, Printer } from 'lucide-react';

export default function ReceiptModal({ payment, onClose }) {
  if (!payment) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="dialog-header">
          <h3 className="dialog-title">Booking Confirmation Receipt</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <CheckCircle2 size={48} color="var(--accent)" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ color: 'var(--accent)', fontSize: '1.6rem', fontWeight: 800 }}>PAID & CONFIRMED</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Reservation #{payment.booking?.id || payment.bookingId} Settled
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', display: 'grid', gap: '0.85rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Transaction Reference:</span>
            <strong style={{ fontFamily: 'monospace', color: '#fff' }}>{payment.txnRef}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Amount Paid:</span>
            <strong style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>₹{payment.amount?.toLocaleString()}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Channel:</span>
            <strong>{payment.paymentMethod || 'CARD'} (Simulated Gateway)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Transaction Timestamp:</span>
            <span>{new Date(payment.paymentTime).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Booked Car:</span>
            <strong>{payment.booking?.car ? `${payment.booking.car.brand} ${payment.booking.car.model}` : (payment.booking?.vehicle?.variant?.name || 'Verified Car')} ({payment.booking?.car?.registrationNumber || payment.booking?.vehicle?.regNumber || 'Verified'})</strong>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
            <Printer size={14} /> Print Receipt
          </button>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

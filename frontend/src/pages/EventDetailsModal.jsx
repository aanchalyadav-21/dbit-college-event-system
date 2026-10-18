import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, MapPin, User, IndianRupee, Users, AlertCircle } from 'lucide-react';
import { getRegistrationsByEvent } from '../api/apiClient';

export default function EventDetailsModal({ event, isOpen, onClose, onRegisterClick }) {
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && event) {
      loadEventRegistrations(event.eventId);
    }
  }, [isOpen, event]);

  const loadEventRegistrations = async (id) => {
    try {
      setLoadingRegs(true);
      setError('');
      const res = await getRegistrationsByEvent(id);
      setRegistrations(res.data || []);
    } catch (err) {
      setError('Could not load attendees for this event.');
    } finally {
      setLoadingRegs(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div>
            <span className={`badge badge-${event.category?.toLowerCase() || 'default'}`} style={{ marginBottom: '0.35rem' }}>
              {event.category}
            </span>
            <h2 className="modal-title">{event.eventName}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Description */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Description
            </h4>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{event.description}</p>
          </div>

          {/* Key Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calendar size={18} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date & Time</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{event.date} at {event.time?.substring(0, 5)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <IndianRupee size={18} color="var(--success)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget Sanctioned</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>₹{Number(event.budget).toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <User size={18} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Organizer</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{event.organizerName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{event.organizerEmail}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <MapPin size={18} color="#e11d48" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Venue & Seating</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{event.venueName} (Cap: {event.venueCapacity})</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {event.venueArea}, {event.venueCity} {event.venueLandmark ? `(${event.venueLandmark})` : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Registered Students Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} /> Registered Students ({registrations.length})
              </h4>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onClose();
                  onRegisterClick(event.eventId);
                }}
              >
                + Register New Student
              </button>
            </div>

            {loadingRegs ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>Loading attendees...</div>
            ) : registrations.length > 0 ? (
              <div className="table-responsive" style={{ maxHeight: '200px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((r, idx) => (
                      <tr key={r.registrationId}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: 600 }}>{r.participantName}</td>
                        <td>{r.participantEmail}</td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {r.registrationDate?.replace('T', ' ').substring(0, 16)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ background: '#f8fafc', padding: '1.25rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No student has registered for this event yet.
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

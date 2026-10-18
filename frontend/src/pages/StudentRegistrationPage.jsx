import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, AlertCircle, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { getEvents, registerStudent } from '../api/apiClient';
import AlertBanner from '../components/AlertBanner';

export default function StudentRegistrationPage({ selectedEventId, setSelectedEventForReg, setActiveTab }) {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [formData, setFormData] = useState({
    eventId: selectedEventId || '',
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState({ type: '', message: '' });
  const [registeredSlip, setRegisteredSlip] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      setFormData((prev) => ({ ...prev, eventId: selectedEventId }));
    }
  }, [selectedEventId]);

  const loadEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await getEvents();
      setEvents(res.data || []);
      if (!selectedEventId && res.data && res.data.length > 0) {
        setFormData((prev) => ({ ...prev, eventId: res.data[0].eventId }));
      }
    } catch (err) {
      setBanner({ type: 'danger', message: 'Failed to load events for registration.' });
    } finally {
      setLoadingEvents(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.eventId) errs.eventId = 'Please select an event';
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.dob) errs.dob = 'Date of birth is required';
    if (!formData.email.trim()) {
      errs.email = 'College email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email format';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setBanner({ type: '', message: '' });
      setRegisteredSlip(null);

      const payload = {
        eventId: Number(formData.eventId),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dob: formData.dob,
        email: formData.email.trim().toLowerCase(),
      };

      const res = await registerStudent(payload);
      setRegisteredSlip(res.data);
      setBanner({
        type: 'success',
        message: 'Registration confirmed! Unique record created in database.',
      });

      // Clear student inputs
      setFormData((prev) => ({
        ...prev,
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
      }));
    } catch (err) {
      // Backend error (e.g. Duplicate registration or Venue Full)
      setBanner({
        type: 'danger',
        message: err.message || 'Registration failed. Duplicate entry or capacity limit exceeded.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const currentSelectedEvent = events.find((e) => String(e.eventId) === String(formData.eventId));

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Event Registration</h1>
          <p className="page-description">
            Register DBIT students for upcoming campus events with automated duplicate-prevention.
          </p>
        </div>
      </div>

      <AlertBanner
        type={banner.type}
        message={banner.message}
        onClose={() => setBanner({ type: '', message: '' })}
      />

      {/* Registration Confirmation Slip */}
      {registeredSlip && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '2px solid #93c5fd',
            marginBottom: '2rem',
          }}
        >
          <div className="card-body" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={28} color="#059669" />
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 800 }}>
                  Registration Slip Confirmed!
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#1e3a8a' }}>
                  Slip ID: #{registeredSlip.registrationId} | Generated on {registeredSlip.registrationDate?.replace('T', ' ').substring(0, 16)}
                </p>
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                border: '1px solid #bfdbfe',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Student</div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{registeredSlip.participantName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{registeredSlip.participantEmail}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Event & Category</div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{registeredSlip.eventName}</div>
                <span className={`badge badge-${registeredSlip.eventCategory?.toLowerCase() || 'default'}`}>
                  {registeredSlip.eventCategory}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date & Venue</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {registeredSlip.eventDate} at {registeredSlip.eventTime?.substring(0, 5)}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{registeredSlip.venueName}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setActiveTab('registrations')}
                >
                  View All Registrations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Registration Form</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            {/* Step 1: Select Event */}
            <div className="form-group">
              <label className="form-label">Step 1: Select Event *</label>
              {loadingEvents ? (
                <div>Loading available events...</div>
              ) : (
                <select
                  className="form-select"
                  value={formData.eventId}
                  onChange={(e) => {
                    setFormData({ ...formData, eventId: e.target.value });
                    if (setSelectedEventForReg) setSelectedEventForReg(e.target.value);
                  }}
                >
                  <option value="">-- Choose an Event --</option>
                  {events.map((evt) => (
                    <option key={evt.eventId} value={evt.eventId}>
                      {evt.eventName} ({evt.category}) - {evt.date} @ {evt.venueName}
                    </option>
                  ))}
                </select>
              )}
              {errors.eventId && <div className="form-error">{errors.eventId}</div>}
            </div>

            {/* Event Quick Info Banner */}
            {currentSelectedEvent && (
              <div
                style={{
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Venue:</span>{' '}
                  <strong>{currentSelectedEvent.venueName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Date:</span>{' '}
                  <strong>{currentSelectedEvent.date}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Available Seats:</span>{' '}
                  <strong>
                    {currentSelectedEvent.venueCapacity
                      ? currentSelectedEvent.venueCapacity - currentSelectedEvent.registrationCount
                      : 'Open'}
                  </strong>
                </div>
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)' }}>
              Step 2: Participant Information
            </h3>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Aarav"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                {errors.firstName && <div className="form-error">{errors.firstName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mehta"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                {errors.lastName && <div className="form-error">{errors.lastName}</div>}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">College Email *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. student@student.dbit.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
                {errors.dob && <div className="form-error">{errors.dob}</div>}
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ background: '#ffffff' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
            >
              {submitting ? 'Verifying & Registering...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { createEvent, updateEvent, getOrganizers, getVenues } from '../api/apiClient';

export default function EventModal({ isOpen, onClose, eventToEdit, onSuccess }) {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    category: 'Technical',
    date: '',
    time: '10:00',
    budget: '',
    organizerId: '',
    venueId: '',
  });

  const [organizers, setOrganizers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadDropdowns();
      if (eventToEdit) {
        setFormData({
          eventName: eventToEdit.eventName || '',
          description: eventToEdit.description || '',
          category: eventToEdit.category || 'Technical',
          date: eventToEdit.date || '',
          time: eventToEdit.time ? eventToEdit.time.substring(0, 5) : '10:00',
          budget: eventToEdit.budget || '',
          organizerId: eventToEdit.organizerId || '',
          venueId: eventToEdit.venueId || '',
        });
      } else {
        setFormData({
          eventName: '',
          description: '',
          category: 'Technical',
          date: '',
          time: '10:00',
          budget: '',
          organizerId: '',
          venueId: '',
        });
      }
      setErrors({});
      setServerError('');
    }
  }, [isOpen, eventToEdit]);

  const loadDropdowns = async () => {
    try {
      const [orgRes, venRes] = await Promise.all([getOrganizers(), getVenues()]);
      setOrganizers(orgRes.data || []);
      setVenues(venRes.data || []);
      if (!eventToEdit) {
        if (orgRes.data && orgRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, organizerId: orgRes.data[0].organizerId }));
        }
        if (venRes.data && venRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, venueId: venRes.data[0].venueId }));
        }
      }
    } catch (err) {
      setServerError('Failed to load organizers or venues.');
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.eventName.trim()) errs.eventName = 'Event name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.time) errs.time = 'Time is required';
    if (formData.budget === '' || Number(formData.budget) < 0) {
      errs.budget = 'Budget must be zero or a positive amount';
    }
    if (!formData.organizerId) errs.organizerId = 'Please select an organizer';
    if (!formData.venueId) errs.venueId = 'Please select a venue';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setServerError('');

      const payload = {
        ...formData,
        budget: Number(formData.budget),
        organizerId: Number(formData.organizerId),
        venueId: Number(formData.venueId),
        time: formData.time.length === 5 ? `${formData.time}:00` : formData.time,
      };

      if (eventToEdit) {
        await updateEvent(eventToEdit.eventId, payload);
        onSuccess('Event updated successfully!');
      } else {
        await createEvent(payload);
        onSuccess('Event created successfully!');
      }
      onClose();
    } catch (err) {
      setServerError(err.message || 'Operation failed. Please verify form details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{eventToEdit ? 'Edit Event' : 'Create New Event'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && (
              <div className="alert-banner alert-danger" style={{ marginBottom: '1rem' }}>
                <AlertCircle size={18} />
                <span>{serverError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Event Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Hackathon DBIT 2026"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              />
              {errors.eventName && <div className="form-error">{errors.eventName}</div>}
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Technical">Technical</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Seminar">Seminar</option>
                </select>
                {errors.category && <div className="form-error">{errors.category}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Sanctioned Budget (INR) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="e.g. 25000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
                {errors.budget && <div className="form-error">{errors.budget}</div>}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                {errors.date && <div className="form-error">{errors.date}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Start Time *</label>
                <input
                  type="time"
                  className="form-input"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
                {errors.time && <div className="form-error">{errors.time}</div>}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Organizer *</label>
                <select
                  className="form-select"
                  value={formData.organizerId}
                  onChange={(e) => setFormData({ ...formData, organizerId: e.target.value })}
                >
                  <option value="">-- Select Organizer --</option>
                  {organizers.map((org) => (
                    <option key={org.organizerId} value={org.organizerId}>
                      {org.name} ({org.email})
                    </option>
                  ))}
                </select>
                {errors.organizerId && <div className="form-error">{errors.organizerId}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Venue *</label>
                <select
                  className="form-select"
                  value={formData.venueId}
                  onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                >
                  <option value="">-- Select Venue --</option>
                  {venues.map((v) => (
                    <option key={v.venueId} value={v.venueId}>
                      {v.name} (Cap: {v.capacity})
                    </option>
                  ))}
                </select>
                {errors.venueId && <div className="form-error">{errors.venueId}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Event Description *</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Details, eligibility criteria, schedule..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : eventToEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

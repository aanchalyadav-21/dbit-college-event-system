import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Building2, Users, Trash2, Edit3, X } from 'lucide-react';
import { getVenues, createVenue, updateVenue, deleteVenue } from '../api/apiClient';
import AlertBanner from '../components/AlertBanner';
import ConfirmModal from '../components/ConfirmModal';

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({ type: '', message: '' });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    area: '',
    city: 'Mumbai',
    landmark: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const res = await getVenues();
      setVenues(res.data || []);
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to load venues.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleOpenAdd = () => {
    setEditingVenue(null);
    setFormData({ name: '', capacity: '', area: '', city: 'Mumbai', landmark: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setEditingVenue(v);
    setFormData({
      name: v.name,
      capacity: v.capacity,
      area: v.area,
      city: v.city,
      landmark: v.landmark || '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Venue name is required';
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      errs.capacity = 'Capacity must be greater than zero';
    }
    if (!formData.area.trim()) errs.area = 'Area is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
      };

      if (editingVenue) {
        await updateVenue(editingVenue.venueId, payload);
        setBanner({ type: 'success', message: 'Venue updated successfully!' });
      } else {
        await createVenue(payload);
        setBanner({ type: 'success', message: 'Venue created successfully!' });
      }
      setIsModalOpen(false);
      fetchVenues();
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!venueToDelete) return;
    try {
      await deleteVenue(venueToDelete.venueId);
      setBanner({ type: 'success', message: `Venue "${venueToDelete.name}" deleted successfully.` });
      setVenueToDelete(null);
      fetchVenues();
    } catch (err) {
      setBanner({
        type: 'danger',
        message: err.message || 'Cannot delete venue because events are booked here.',
      });
      setVenueToDelete(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Campus Venue Management</h1>
          <p className="page-description">
            Maintain campus halls, auditoriums, and labs with capacity limits and location details.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Venue
        </button>
      </div>

      <AlertBanner
        type={banner.type}
        message={banner.message}
        onClose={() => setBanner({ type: '', message: '' })}
      />

      {/* Venues Grid */}
      {loading ? (
        <div className="empty-state">
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem' }}>Loading venues...</p>
        </div>
      ) : venues.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {venues.map((v) => (
            <div key={v.venueId} className="card" style={{ marginBottom: 0 }}>
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: '1.1rem' }}>{v.name}</h3>
                <span className="badge badge-technical">Cap: {v.capacity}</span>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div>{v.area}, {v.city}</div>
                      {v.landmark && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Landmark: {v.landmark}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} color="var(--accent)" />
                    <span>Max Audience: <strong>{v.capacity} seats</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(v)}>
                    <Edit3 size={14} /> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setVenueToDelete(v)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <Building2 className="empty-icon" />
            <p>No venues registered.</p>
          </div>
        </div>
      )}

      {/* Add / Edit Venue Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingVenue ? 'Edit Venue' : 'Add Campus Venue'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Venue Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mazzarello Multipurpose Hall"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Max Seating Capacity *</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      placeholder="e.g. 350"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    />
                    {errors.capacity && <div className="form-error">{errors.capacity}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    {errors.city && <div className="form-error">{errors.city}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Area / Wing *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Engineering Block A, 1st Floor"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                  {errors.area && <div className="form-error">{errors.area}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Landmark</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Near Main College Reception"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingVenue ? 'Update Venue' : 'Create Venue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!venueToDelete}
        title="Delete Venue?"
        message={`Are you sure you want to delete "${venueToDelete?.name}"? If events are currently booked in this venue, deletion will be safely restricted by database integrity rules.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setVenueToDelete(null)}
      />
    </div>
  );
}

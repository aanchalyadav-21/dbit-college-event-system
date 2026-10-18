import React, { useState, useEffect } from 'react';
import { Plus, Users, Mail, Trash2, Edit3, X, AlertCircle } from 'lucide-react';
import { getOrganizers, createOrganizer, updateOrganizer, deleteOrganizer } from '../api/apiClient';
import AlertBanner from '../components/AlertBanner';
import ConfirmModal from '../components/ConfirmModal';

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({ type: '', message: '' });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState(null);

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      const res = await getOrganizers();
      setOrganizers(res.data || []);
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to load organizers.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const handleOpenAdd = () => {
    setEditingOrg(null);
    setFormData({ name: '', email: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (org) => {
    setEditingOrg(org);
    setFormData({ name: org.name, email: org.email });
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Organizer name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (editingOrg) {
        await updateOrganizer(editingOrg.organizerId, formData);
        setBanner({ type: 'success', message: 'Organizer updated successfully!' });
      } else {
        await createOrganizer(formData);
        setBanner({ type: 'success', message: 'Organizer added successfully!' });
      }
      setIsModalOpen(false);
      fetchOrganizers();
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!orgToDelete) return;
    try {
      await deleteOrganizer(orgToDelete.organizerId);
      setBanner({ type: 'success', message: `Organizer "${orgToDelete.name}" deleted successfully.` });
      setOrgToDelete(null);
      fetchOrganizers();
    } catch (err) {
      setBanner({
        type: 'danger',
        message: err.message || 'Cannot delete organizer because events are assigned to them.',
      });
      setOrgToDelete(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Organizer Management</h1>
          <p className="page-description">
            Faculty coordinators and student council committees responsible for hosting DBIT events.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Organizer
        </button>
      </div>

      <AlertBanner
        type={banner.type}
        message={banner.message}
        onClose={() => setBanner({ type: '', message: '' })}
      />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Registered Organizers ({organizers.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="empty-state">
              <div className="spinner"></div>
              <p style={{ marginTop: '1rem' }}>Loading organizers...</p>
            </div>
          ) : organizers.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Organizer ID</th>
                    <th>Name / Council</th>
                    <th>Email Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {organizers.map((org) => (
                    <tr key={org.organizerId}>
                      <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>#{org.organizerId}</td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{org.name}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Mail size={14} color="var(--text-muted)" />
                          <span>{org.email}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEdit(org)}
                            title="Edit Organizer"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setOrgToDelete(org)}
                            title="Delete Organizer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Users className="empty-icon" />
              <p>No organizers found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Organizer Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingOrg ? 'Edit Organizer' : 'Add Organizer'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Organizer Name / Body *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CSI Student Council DBIT"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Official Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. csi@dbit.ac.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingOrg ? 'Update' : 'Add Organizer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!orgToDelete}
        title="Delete Organizer?"
        message={`Are you sure you want to delete "${orgToDelete?.name}"? If events are assigned to this organizer, deletion will be safely restricted by database integrity rules.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOrgToDelete(null)}
      />
    </div>
  );
}

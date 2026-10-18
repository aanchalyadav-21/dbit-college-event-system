import React, { useState, useEffect } from 'react';
import { Search, Trash2, RefreshCw, ClipboardList, Filter } from 'lucide-react';
import { getRegistrations, cancelRegistration, getEvents } from '../api/apiClient';
import AlertBanner from '../components/AlertBanner';
import ConfirmModal from '../components/ConfirmModal';

export default function RegistrationsListPage() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('All');
  const [banner, setBanner] = useState({ type: '', message: '' });
  const [regToCancel, setRegToCancel] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [regRes, evtRes] = await Promise.all([getRegistrations(), getEvents()]);
      setRegistrations(regRes.data || []);
      setEvents(evtRes.data || []);
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to load registrations.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmCancel = async () => {
    if (!regToCancel) return;
    try {
      await cancelRegistration(regToCancel.registrationId);
      setBanner({
        type: 'success',
        message: `Registration #${regToCancel.registrationId} for ${regToCancel.participantName} cancelled successfully.`,
      });
      setRegToCancel(null);
      fetchData();
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Could not cancel registration.' });
      setRegToCancel(null);
    }
  };

  // Filter registrations by search and event
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesEvent = eventFilter === 'All' || String(reg.eventId) === String(eventFilter);
    const query = search.toLowerCase();
    const matchesSearch =
      !search ||
      reg.participantName?.toLowerCase().includes(query) ||
      reg.participantEmail?.toLowerCase().includes(query) ||
      reg.eventName?.toLowerCase().includes(query);
    return matchesEvent && matchesSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Registration Management</h1>
          <p className="page-description">
            View all confirmed student enrollments, search by attendee or event, and safely manage cancellations.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchData}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <AlertBanner
        type={banner.type}
        message={banner.message}
        onClose={() => setBanner({ type: '', message: '' })}
      />

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-input-wrap" style={{ flex: 1, minWidth: '240px' }}>
              <Search size={16} className="search-icon-inside" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by student name, email, or event..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '200px' }}
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="All">All Events ({registrations.length})</option>
                {events.map((evt) => (
                  <option key={evt.eventId} value={evt.eventId}>
                    {evt.eventName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Enrolled Students ({filteredRegistrations.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="empty-state">
              <div className="spinner"></div>
              <p style={{ marginTop: '1rem' }}>Loading registrations...</p>
            </div>
          ) : filteredRegistrations.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reg ID</th>
                    <th>Participant</th>
                    <th>College Email</th>
                    <th>Event Title</th>
                    <th>Category</th>
                    <th>Event Date & Venue</th>
                    <th>Registration Timestamp</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.registrationId}>
                      <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                        #{reg.registrationId}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {reg.participantName}
                      </td>
                      <td>{reg.participantEmail}</td>
                      <td style={{ fontWeight: 600 }}>{reg.eventName}</td>
                      <td>
                        <span className={`badge badge-${reg.eventCategory?.toLowerCase() || 'default'}`}>
                          {reg.eventCategory}
                        </span>
                      </td>
                      <td>
                        <div>{reg.eventDate}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {reg.venueName}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {reg.registrationDate?.replace('T', ' ').substring(0, 16)}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setRegToCancel(reg)}
                          title="Cancel Registration"
                        >
                          <Trash2 size={14} /> Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <ClipboardList className="empty-icon" />
              <h3>No Registrations Found</h3>
              <p>No student enrollment matches your current filter or search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={!!regToCancel}
        title="Cancel Registration?"
        message={`Are you sure you want to cancel the registration for "${regToCancel?.participantName}" in "${regToCancel?.eventName}"?`}
        confirmText="Confirm Cancellation"
        onConfirm={handleConfirmCancel}
        onCancel={() => setRegToCancel(null)}
      />
    </div>
  );
}

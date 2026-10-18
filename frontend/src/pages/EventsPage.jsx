import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Clock, MapPin, IndianRupee, Users, Trash2, Edit3, Eye, AlertCircle } from 'lucide-react';
import { getEvents, deleteEvent } from '../api/apiClient';
import AlertBanner from '../components/AlertBanner';
import ConfirmModal from '../components/ConfirmModal';
import EventModal from './EventModal';
import EventDetailsModal from './EventDetailsModal';

export default function EventsPage({ setActiveTab, setSelectedEventForReg }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [banner, setBanner] = useState({ type: '', message: '' });

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Delete modal state
  const [eventToDelete, setEventToDelete] = useState(null);

  const categories = ['All', 'Technical', 'Workshop', 'Cultural', 'Sports', 'Seminar'];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getEvents(search, selectedCategory);
      setEvents(res.data || []);
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to fetch events from backend.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleOpenAdd = () => {
    setEventToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEventToEdit(evt);
    setIsFormModalOpen(true);
  };

  const handleOpenDetails = (evt) => {
    setSelectedEvent(evt);
    setIsDetailsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent(eventToDelete.eventId);
      setBanner({ type: 'success', message: `Event "${eventToDelete.eventName}" deleted successfully.` });
      setEventToDelete(null);
      fetchEvents();
    } catch (err) {
      setBanner({
        type: 'danger',
        message: err.message || 'Cannot delete event. Please check if student registrations exist.',
      });
      setEventToDelete(null);
    }
  };

  const handleQuickRegister = (eventId) => {
    setSelectedEventForReg(eventId);
    setActiveTab('register');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Events Catalog</h1>
          <p className="page-description">
            Explore, create, and manage campus events across technical, cultural, and sports domains.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Create Event
        </button>
      </div>

      <AlertBanner
        type={banner.type}
        message={banner.message}
        onClose={() => setBanner({ type: '', message: '' })}
      />

      {/* Search and Category Filter Bar */}
      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-wrap">
          <Search size={18} className="search-icon-inside" />
          <input
            type="text"
            className="search-input"
            placeholder="Search events by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="empty-state">
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem' }}>Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="event-grid">
          {events.map((evt) => (
            <div key={evt.eventId} className="event-card">
              <div className="event-card-header">
                <div>
                  <span className={`badge badge-${evt.category?.toLowerCase() || 'default'}`} style={{ marginBottom: '0.4rem' }}>
                    {evt.category}
                  </span>
                  <h3 className="event-name">{evt.eventName}</h3>
                </div>
              </div>

              <div className="event-card-body">
                <p className="event-desc">{evt.description}</p>

                <div className="event-meta-list">
                  <div className="event-meta-item">
                    <Calendar size={14} color="var(--accent)" />
                    <span>
                      {evt.date} at {evt.time?.substring(0, 5)}
                    </span>
                  </div>

                  <div className="event-meta-item">
                    <MapPin size={14} color="#e11d48" />
                    <span>
                      {evt.venueName} (Cap: {evt.venueCapacity})
                    </span>
                  </div>

                  <div className="event-meta-item">
                    <Users size={14} color="var(--primary)" />
                    <span>
                      Organizer: <strong>{evt.organizerName}</strong>
                    </span>
                  </div>

                  <div className="event-meta-item">
                    <IndianRupee size={14} color="var(--success)" />
                    <span>
                      Budget: <strong>₹{Number(evt.budget).toLocaleString('en-IN')}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem' }}>
                    Registrations:{' '}
                    <strong style={{ color: 'var(--accent)', fontSize: '1rem' }}>
                      {evt.registrationCount}
                    </strong>
                    {evt.venueCapacity ? ` / ${evt.venueCapacity}` : ''}
                  </div>
                  {evt.venueCapacity && evt.registrationCount >= evt.venueCapacity && (
                    <span style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 700 }}>
                      HOUSEFULL
                    </span>
                  )}
                </div>
              </div>

              <div className="event-card-footer">
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenDetails(evt)}
                    title="View Details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenEdit(evt)}
                    title="Edit Event"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setEventToDelete(evt)}
                    title="Delete Event"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleQuickRegister(evt.eventId)}
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <Calendar className="empty-icon" />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>No Events Found</h3>
            <p>Try adjusting your search query or category filter, or click "Create Event" to add one.</p>
          </div>
        </div>
      )}

      {/* Add / Edit Event Modal */}
      <EventModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        eventToEdit={eventToEdit}
        onSuccess={(msg) => {
          setBanner({ type: 'success', message: msg });
          fetchEvents();
        }}
      />

      {/* Detailed Event Modal */}
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        event={selectedEvent}
        onClose={() => setIsDetailsModalOpen(false)}
        onRegisterClick={(id) => handleQuickRegister(id)}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!eventToDelete}
        title="Delete Event?"
        message={`Are you sure you want to delete "${eventToDelete?.eventName}"? If any students are already registered for this event, the database constraint will safely prevent deletion.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </div>
  );
}

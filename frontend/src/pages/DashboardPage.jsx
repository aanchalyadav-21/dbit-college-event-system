import React, { useEffect, useState } from 'react';
import { Calendar, Users, ClipboardCheck, Building2, PlusCircle, ArrowRight, RefreshCw, Trophy, BookOpen } from 'lucide-react';
import { getDashboardSummary } from '../api/apiClient';
import AlertBanner from '../components/AlertBanner';

export default function DashboardPage({ setActiveTab, setSelectedEventForReg }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getDashboardSummary();
      setSummary(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleQuickRegister = (event) => {
    setSelectedEventForReg(event.eventId);
    setActiveTab('register');
  };

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Loading live DBIT dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-description">
            Live database insights for campus events, student registrations, and venue bookings.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchSummary} title="Refresh Database Data">
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('events')}>
            <PlusCircle size={16} /> Manage Events
          </button>
        </div>
      </div>

      <AlertBanner type="danger" message={error} onClose={() => setError('')} />

      {/* 4 Core Metric Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Calendar size={26} />
          </div>
          <div>
            <div className="stat-value">{summary?.totalEvents ?? 0}</div>
            <div className="stat-label">Total Events</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Trophy size={26} />
          </div>
          <div>
            <div className="stat-value">{summary?.upcomingEvents ?? 0}</div>
            <div className="stat-label">Upcoming Events</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <ClipboardCheck size={26} />
          </div>
          <div>
            <div className="stat-value">{summary?.totalRegistrations ?? 0}</div>
            <div className="stat-label">Total Registrations</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Building2 size={26} />
          </div>
          <div>
            <div className="stat-value">{summary?.totalVenues ?? 0}</div>
            <div className="stat-label">Campus Venues</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Upcoming Events List */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">Featured Upcoming Events</h2>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setActiveTab('events')}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {summary?.recentUpcomingEvents && summary.recentUpcomingEvents.length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Category</th>
                      <th>Date & Time</th>
                      <th>Venue</th>
                      <th>Registrations</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.recentUpcomingEvents.map((evt) => (
                      <tr key={evt.eventId}>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                          {evt.eventName}
                        </td>
                        <td>
                          <span className={`badge badge-${evt.category?.toLowerCase() || 'default'}`}>
                            {evt.category}
                          </span>
                        </td>
                        <td>
                          {evt.date} at {evt.time?.substring(0, 5)}
                        </td>
                        <td>{evt.venueName}</td>
                        <td>
                          <strong style={{ color: 'var(--accent)' }}>{evt.registrationCount}</strong>
                          {evt.venueCapacity ? ` / ${evt.venueCapacity}` : ''}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleQuickRegister(evt)}
                          >
                            Register
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No upcoming events currently scheduled.</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2 className="card-title">Category Breakdown</h2>
          </div>
          <div className="card-body">
            {summary?.categoryCounts && Object.keys(summary.categoryCounts).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(summary.categoryCounts).map(([cat, count]) => {
                  const percentage = summary.totalEvents
                    ? Math.round((count / summary.totalEvents) * 100)
                    : 0;
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.88rem' }}>
                        <span style={{ fontWeight: 600 }}>{cat}</span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {count} event{count > 1 ? 's' : ''} ({percentage}%)
                        </span>
                      </div>
                      <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            background: 'var(--accent)',
                            width: `${percentage}%`,
                            height: '100%',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '1.5rem' }}>
                <p>No category statistics available.</p>
              </div>
            )}

            <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>
                Quick Actions:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => setActiveTab('register')}
                >
                  <Users size={14} /> Student Registration Form
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => setActiveTab('venues')}
                >
                  <Building2 size={14} /> View Campus Venues & Capacity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

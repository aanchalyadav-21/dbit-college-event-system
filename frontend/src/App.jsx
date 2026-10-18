import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import StudentRegistrationPage from './pages/StudentRegistrationPage';
import RegistrationsListPage from './pages/RegistrationsListPage';
import OrganizersPage from './pages/OrganizersPage';
import VenuesPage from './pages/VenuesPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            setActiveTab={setActiveTab}
            setSelectedEventForReg={setSelectedEventForReg}
          />
        );
      case 'events':
        return (
          <EventsPage
            setActiveTab={setActiveTab}
            setSelectedEventForReg={setSelectedEventForReg}
          />
        );
      case 'register':
        return (
          <StudentRegistrationPage
            selectedEventId={selectedEventForReg}
            setSelectedEventForReg={setSelectedEventForReg}
            setActiveTab={setActiveTab}
          />
        );
      case 'registrations':
        return <RegistrationsListPage />;
      case 'organizers':
        return <OrganizersPage />;
      case 'venues':
        return <VenuesPage />;
      default:
        return (
          <DashboardPage
            setActiveTab={setActiveTab}
            setSelectedEventForReg={setSelectedEventForReg}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">{renderActiveTab()}</main>
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          background: '#ffffff',
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}
      >
        <p>
          <strong>College Event Management System</strong> — Don Bosco Institute of Technology (DBIT)
        </p>
        <p style={{ marginTop: '0.25rem' }}>
          B.Tech Semester 3 Mini-Project • Full-Stack Java (Spring Boot) & React & MySQL
        </p>
      </footer>
    </div>
  );
}

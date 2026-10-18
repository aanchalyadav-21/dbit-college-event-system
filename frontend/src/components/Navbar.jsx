import React from 'react';
import { Calendar, LayoutDashboard, UserCheck, Users, MapPin, ClipboardList, GraduationCap } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events Catalog', icon: Calendar },
    { id: 'register', label: 'Student Register', icon: UserCheck },
    { id: 'registrations', label: 'Registrations', icon: ClipboardList },
    { id: 'organizers', label: 'Organizers', icon: Users },
    { id: 'venues', label: 'Venues', icon: MapPin },
  ];

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-badge">DBIT</div>
          <div className="brand-text">
            <div className="brand-title">Event Management Portal</div>
            <div className="brand-subtitle">Don Bosco Institute of Technology</div>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

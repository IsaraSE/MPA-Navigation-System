import React, { useState } from 'react';
import { Search, Anchor, AlertTriangle, FileText, Info } from 'lucide-react';

const Header = ({ activeSection, setActiveSection }) => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      color: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.75rem',
          fontWeight: 'bold'
        }}>
          <Anchor size={32} style={{ marginRight: '0.75rem', color: '#60a5fa' }} />
          <span>EcoNav</span>
          <span style={{
            fontSize: '0.75rem',
            backgroundColor: '#16a34a',
            padding: '0.25rem 0.5rem',
            borderRadius: '12px',
            marginLeft: '0.5rem'
          }}>
            LIVE
          </span>
        </div>

        {/* Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          {[
            { icon: Search, label: 'Ship Tracker', id: 'tracker' },
            { icon: AlertTriangle, label: 'Marine Zones', id: 'zones' },
            { icon: FileText, label: 'Reporting', id: 'reporting' },
            { icon: Info, label: 'About', id: 'about' }
          ].map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: activeSection === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem'
              }}
              onClick={() => setActiveSection(item.id)}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.target.closest('div').style.backgroundColor = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.target.closest('div').style.backgroundColor = 'transparent';
                }
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: '25px',
          padding: '0.5rem 1rem',
          minWidth: '250px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Search size={18} style={{ marginRight: '0.5rem', opacity: 0.8 }} />
          <input
            type="text"
            placeholder="Search vessels, routes..."
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontSize: '0.95rem',
              backgroundColor: 'transparent',
              color: 'white'
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Anchor, AlertTriangle, FileText, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserDropdown from './UserDropdown';

const Header = ({ activeSection, setActiveSection }) => {
  const { isAuthenticated } = useAuth();
  
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
        <Link
          to="/home"
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
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
        </Link>

        {/* Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          {[
            { icon: Search, label: 'Ship Tracker', id: 'tracker', link: '/home' },
            { icon: AlertTriangle, label: 'Marine Zones', id: 'zones', link: '/home' },
            { icon: FileText, label: 'Reporting', id: 'reporting', link: '/report' },
            { icon: Info, label: 'About', id: 'about', link: '/home' }
          ].map(item => (
            <Link
              key={item.id}
              to={item.link}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: activeSection === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem',
                color: 'white',
                textDecoration: 'none'
              }}
              onClick={() => setActiveSection(item.id)}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Search Bar and User Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
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
          
          {/* Authentication Section */}
          {isAuthenticated ? (
            /* User Dropdown for logged in users */
            <UserDropdown />
          ) : (
            /* Login button for non-logged in users */
            <Link
              to="/login"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.2s ease',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

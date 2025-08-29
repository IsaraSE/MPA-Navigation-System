import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ShipMap from '../components/ShipMap';
import StatsCards from '../components/StatsCards';
import FeaturesGrid from '../components/FeaturesGrid';
import TechnologyStack from '../components/TechnologyStack';
import { Activity, Compass, Route, Waves, Navigation, Settings, AlertTriangle } from 'lucide-react';
import '../Styles/global.css';

const Home = () => {
  const [activeSection, setActiveSection] = useState('tracker');

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Enhanced Page Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '2rem',
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #8b5cf6)'
          }} />
          
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #1e40af, #059669)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}>
             Smart Maritime Navigator For Ships
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            margin: '0 0 1.5rem 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Real-time vessel tracking and sustainable route optimization
          </p>
          
          {/* Live Status Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: Activity, label: 'System Status', value: 'Online', color: '#10b981' },
              { icon: Compass, label: 'GPS Accuracy', value: '±2m', color: '#3b82f6' },
              { icon: Route, label: 'Data Update', value: 'Real-time', color: '#f59e0b' }
            ].map((status, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'white',
                borderRadius: '25px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: `2px solid ${status.color}20`
              }}>
                <status.icon size={18} style={{ color: status.color }} />
                <span style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>
                  {status.label}: 
                </span>
                <span style={{ color: status.color, fontSize: '0.9rem', fontWeight: '700' }}>
                  {status.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <StatsCards />

        {/* Enhanced Map Section - Made Wider */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid #e5e7eb',
          marginBottom: '3rem',
          overflow: 'hidden'
        }}>
          {/* Map Header */}
          <div style={{
            padding: '2rem 2rem 1.5rem 2rem',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 0.5rem 0',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Waves size={28} style={{ marginRight: '0.75rem', color: '#3b82f6' }} />
                  Live Maritime Traffic Map
                </h2>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  fontSize: '1rem'
                }}>
                  Real-time vessel positions, routes, and navigation data
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                {/* Legend */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem'
                }}>
                  {[
                    { color: '#e74c3c', label: 'Cargo' },
                    { color: '#f39c12', label: 'Tanker' },
                    { color: '#1abc9c', label: 'Cruise' },
                    { color: '#9b59b6', label: 'Container' }
                  ].map((type, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: type.color,
                        borderRadius: '50%'
                      }} />
                      <span style={{ color: '#374151' }}>{type.label}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '12px',
                  border: '1px solid #bbf7d0',
                  fontSize: '0.875rem'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }} />
                  <span style={{ color: '#166534', fontWeight: '600' }}>Live Tracking Active</span>
                </div>
                
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }}
                >
                  <Settings size={16} />
                  Map Settings
                </button>
              </div>
            </div>
            
            {/* Enhanced Map Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              {[
                { label: 'Total Distance Tracked', value: '2,847 nm', icon: Route },
                { label: 'Active Shipping Lanes', value: '4 major routes', icon: Navigation },
                { label: 'Avg Fleet Speed', value: '15.2 knots', icon: Activity },
                { label: 'Environmental Zones', value: '3 monitored', icon: AlertTriangle }
              ].map((stat, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#3b82f620',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <stat.icon size={18} style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#6b7280'
                    }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Map Container - Made Full Width */}
          <div style={{ 
            padding: '0',
            height: '600px' // Increased height for better visibility
          }}>
            <div style={{ 
              height: '100%',
              borderRadius: '0 0 20px 20px',
              overflow: 'hidden'
            }}>
              <ShipMap />
            </div>
          </div>
        </div>

        <FeaturesGrid />
        <TechnologyStack />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
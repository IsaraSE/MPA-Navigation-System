import React from 'react';

const TechnologyStack = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '3rem',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid #e5e7eb',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: 'linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #8b5cf6, #ef4444)',
        opacity: 0.8
      }} />
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #1e40af, #059669)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Powered by Advanced Maritime Technology
        </h2>
        
        <p style={{
          color: '#6b7280',
          fontSize: '1.25rem',
          marginBottom: '2.5rem',
          lineHeight: '1.7'
        }}>
          Cutting-edge integration of AIS data, satellite tracking, and AI-powered route optimization 
          for sustainable and efficient maritime operations worldwide.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {[
            { tech: 'AIS Integration', icon: '📡', desc: 'Real-time vessel data' },
            { tech: 'Satellite Tracking', icon: '🛰️', desc: 'Global coverage' },
            { tech: 'Weather Routing', icon: '🌦️', desc: 'Optimal conditions' },
            { tech: 'Emission Monitoring', icon: '🌱', desc: 'Environmental tracking' },
            { tech: 'Port Integration', icon: '⚓', desc: 'Harbor connectivity' },
            { tech: 'Real-time Alerts', icon: '🚨', desc: 'Instant notifications' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: "1px solid '#e2e8f",
                color: '#475569',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f1f5f9';
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.75rem'
              }}>
                {item.icon}
              </div>
              <div style={{
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                {item.tech}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: '#6b7280'
              }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologyStack;
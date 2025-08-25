import React from 'react';
import { Ship, Route, Clock, MapPin } from 'lucide-react';

const StatsCards = () => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem'
    }}>
      {[
        { icon: Ship, label: 'Active Vessels', value: '4', subtext: 'Currently Tracked', color: '#3b82f6', trend: '+2 today' },
        { icon: Route, label: 'Ocean Routes', value: '8', subtext: 'Major Shipping Lanes', color: '#10b981', trend: '4 active' },
        { icon: Clock, label: 'Avg. Speed', value: '15.2 kn', subtext: 'Fleet Average', color: '#f59e0b', trend: '+0.8 kn' },
        { icon: MapPin, label: 'Ports Served', value: '12', subtext: 'Global Network', color: '#8b5cf6', trend: '6 continents' }
      ].map((stat, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.closest('div').style.transform = 'translateY(-8px)';
            e.target.closest('div').style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.target.closest('div').style.transform = 'translateY(0)';
            e.target.closest('div').style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
          }}
        >
          {/* Background Decoration */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: `linear-gradient(135deg, ${stat.color}10, ${stat.color}05)`,
            borderRadius: '0 16px 0 100%'
          }} />
          
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: stat.color + '15',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            position: 'relative',
            zIndex: 1
          }}>
            <stat.icon size={28} style={{ color: stat.color }} />
          </div>
          
          <h3 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 0.5rem 0'
          }}>
            {stat.value}
          </h3>
          
          <p style={{
            color: '#6b7280',
            margin: '0 0 0.75rem 0',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            {stat.label}
          </p>
          
          <p style={{
            color: '#9ca3af',
            margin: '0 0 1rem 0',
            fontSize: '0.875rem'
          }}>
            {stat.subtext}
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: stat.color + '10',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            color: stat.color
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              backgroundColor: stat.color,
              borderRadius: '50%'
            }} />
            {stat.trend}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
import React from 'react';
import { AlertTriangle, BarChart3 } from 'lucide-react';

const FeaturesGrid = () => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #f59e0b20, #f59e0b10)',
          borderRadius: '50%'
        }} />
        
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <AlertTriangle size={24} style={{ marginRight: '0.75rem', color: '#f59e0b' }} />
          Environmental Compliance
        </h3>
        
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '1.5rem',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Advanced monitoring system for marine protected areas, emission control zones, and environmental regulations.
        </p>
        
        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          {[
            { icon: '🌊', title: 'Marine Protected Areas', desc: 'Real-time zone monitoring and alerts' },
            { icon: '📊', title: 'Emission Tracking', desc: 'Comprehensive environmental impact analysis' },
            { icon: '🎯', title: 'Route Optimization', desc: 'Eco-friendly path recommendations' }
          ].map((feature, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                fontSize: '1.5rem',
                width: '40px',
                textAlign: 'center'
              }}>
                {feature.icon}
              </div>
              <div>
                <div style={{
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  {feature.title}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#6b7280'
                }}>
                  {feature.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #10b98120, #10b98110)',
          borderRadius: '50%'
        }} />
        
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <BarChart3 size={24} style={{ marginRight: '0.75rem', color: '#10b981' }} />
          Advanced Analytics
        </h3>
        
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '1.5rem',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Comprehensive fleet performance insights with AI-powered optimization and predictive analytics.
        </p>
        
        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          {[
            { icon: '⛽', title: 'Fuel Efficiency', desc: 'Real-time consumption monitoring' },
            { icon: '🔍', title: 'Performance Metrics', desc: 'Detailed operational analytics' },
            { icon: '🌍', title: 'Carbon Footprint', desc: 'Environmental impact assessment' }
          ].map((feature, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #dcfce7'
            }}>
              <div style={{
                fontSize: '1.5rem',
                width: '40px',
                textAlign: 'center'
              }}>
                {feature.icon}
              </div>
              <div>
                <div style={{
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  {feature.title}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#6b7280'
                }}>
                  {feature.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;
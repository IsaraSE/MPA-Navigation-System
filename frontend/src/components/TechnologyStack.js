import React from 'react';
import { Satellite, Map, Database, Cpu, Shield, Cloud, Navigation, Waves, AlertTriangle, Zap, Globe, BarChart3 } from 'lucide-react';

const TechnologyStack = () => {
  const technologies = [
    {
      category: "Mapping & Visualization",
      items: [
        {
          name: "Leaflet Maps API",
          description: "Open-source JavaScript library for interactive maps",
          icon: <Map size={24} />,
          color: "#28a745",
          features: ["Custom vessel markers", "Interactive zone polygons", "Real-time position updates"]
        },
        {
          name: "Esri World Imagery",
          description: "High-resolution satellite and aerial imagery",
          icon: <Globe size={24} />,
          color: "#007bff",
          features: ["Base map layer", "Oceanographic data", "Coastal details"]
        }
      ]
    },
    {
      category: "Environmental Data",
      items: [
        {
          name: "Marine Protected Areas API",
          description: "Global database of sensitive marine zones",
          icon: <Shield size={24} />,
          color: "#ffc107",
          features: ["Real-world coordinates", "Restriction details", "Authority information"]
        },
        {
          name: "AIS Vessel Tracking",
          description: "Automatic Identification System data integration",
          icon: <Navigation size={24} />,
          color: "#17a2b8",
          features: ["Live vessel positions", "Ship metadata", "Movement patterns"]
        }
      ]
    },
    {
      category: "Backend & Processing",
      items: [
        {
          name: "WebSocket API",
          description: "Real-time bidirectional communication",
          icon: <Zap size={24} />,
          color: "#fd7e14",
          features: ["Live data streaming", "Instant updates", "Low latency connection"]
        },
        {
          name: "Geospatial Processing",
          description: "Coordinate calculations and route optimization",
          icon: <Cpu size={24} />,
          color: "#6f42c1",
          features: ["Bearing calculations", "Collision detection", "Zone violation alerts"]
        }
      ]
    },
    {
      category: "Data & Infrastructure",
      items: [
        {
          name: "CDN Resources",
          description: "Content delivery for mapping libraries",
          icon: <Cloud size={24} />,
          color: "#6c757d",
          features: ["Fast loading", "Reliable delivery", "Global availability"]
        },
        {
          name: "Maritime Databases",
          description: "Vessel information and zone specifications",
          icon: <Database size={24} />,
          color: "#20c997",
          features: ["Ship registry data", "Environmental regulations", "Historical tracking"]
        }
      ]
    }
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '3rem 2rem',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid #e5e7eb',
      position: 'relative',
      overflow: 'hidden',
      margin: '2rem 0'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: 'linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #8b5cf6)',
        opacity: 0.8
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, #e0f2fe 0%, transparent 70%)',
        opacity: 0.5,
        zIndex: 0
      }} />
      
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '0.5rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1e40af, #059669)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Advanced Technology Stack
        </h2>
        
        <p style={{
          color: '#6b7280',
          fontSize: '1.1rem',
          marginBottom: '3rem',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          Our maritime monitoring system integrates multiple cutting-edge technologies 
          to provide comprehensive vessel tracking and environmental protection.
        </p>
        
        {technologies.map((category, categoryIndex) => (
          <div key={categoryIndex} style={{ marginBottom: '3rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                padding: '0.5rem',
                borderRadius: '8px',
                marginRight: '0.75rem',
                display: 'inline-flex',
                color: 'white'
              }}>
                {categoryIndex === 0 && <Map size={20} />}
                {categoryIndex === 1 && <Shield size={20} />}
                {categoryIndex === 2 && <Cpu size={20} />}
                {categoryIndex === 3 && <Database size={20} />}
              </span>
              {category.category}
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {category.items.map((tech, techIndex) => (
                <div
                  key={techIndex}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '4px',
                    backgroundColor: tech.color
                  }} />
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      padding: '0.5rem',
                      borderRadius: '10px',
                      backgroundColor: tech.color + '20',
                      color: tech.color,
                      marginRight: '0.75rem',
                      display: 'flex'
                    }}>
                      {tech.icon}
                    </div>
                    <div>
                      <h4 style={{
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: 0
                      }}>
                        {tech.name}
                      </h4>
                      <p style={{
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        margin: '0.25rem 0 0 0'
                      }}>
                        {tech.description}
                      </p>
                    </div>
                  </div>
                  
                  <ul style={{
                    paddingLeft: '1.5rem',
                    margin: 0,
                    fontSize: '0.85rem'
                  }}>
                    {tech.features.map((feature, featureIndex) => (
                      <li key={featureIndex} style={{
                        color: '#4b5563',
                        marginBottom: '0.4rem',
                        position: 'relative'
                      }}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #bae6fd',
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            padding: '0.75rem',
            borderRadius: '10px',
            backgroundColor: '#0369a1',
            color: 'white',
            marginRight: '1rem',
            display: 'flex'
          }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e' }}>
              Integrated Data Ecosystem
            </h4>
            <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem' }}>
              All technologies work together seamlessly to provide real-time maritime intelligence 
              and environmental protection monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyStack;
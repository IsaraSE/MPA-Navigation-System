import React from 'react';
import { Anchor } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      color: 'white',
      padding: '4rem 2rem 2rem 2rem',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Company Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.75rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem'
            }}>
              <Anchor size={32} style={{ marginRight: '0.75rem', color: '#60a5fa' }} />
              EcoNav
            </div>
            <p style={{ 
              color: '#9ca3af', 
              marginBottom: '2rem',
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              Leading the future of sustainable maritime navigation with cutting-edge real-time tracking,
              environmental optimization, and AI-powered route planning solutions.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              {['🌊', '⚓', '🚢', '🌍'].map((emoji, index) => (
                <div
                  key={index}
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(96, 165, 250, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(96, 165, 250, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(96, 165, 250, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#f3f4f6'
            }}>
              Navigation
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Fleet Tracking Dashboard',
                'Route Planning & Optimization',
                'Environmental Zone Monitoring',
                'Real-time Analytics',
                'API Documentation',
                'Maritime Resources'
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '0.75rem' }}>
                  <a
                    href="#"
                    style={{
                      color: '#9ca3af',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#60a5fa';
                      e.target.style.paddingLeft = '0.5rem';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#9ca3af';
                      e.target.style.paddingLeft = '0';
                    }}
                  >
                    <span>→</span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#f3f4f6'
            }}>
              Get In Touch
            </h3>
            <div style={{ color: '#9ca3af', fontSize: '1rem' }}>
              <div style={{ 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#3b82f620',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  📧
                </div>
                <span>support@econav.maritime</span>
              </div>
              <div style={{ 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#3b82f620',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  📞
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div style={{ 
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#3b82f620',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  📍
                </div>
                <span>Maritime Technology Center, Port District</span>
              </div>
              
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#60a5fa',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    🚨
                  </div>
                  <strong style={{ color: '#60a5fa', fontSize: '1.1rem' }}>24/7 Maritime Support</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                  Emergency assistance and technical support available around the clock
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div style={{ 
            color: '#9ca3af', 
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>© 2025 EcoNav Maritime Solutions.</span>
            <span>All rights reserved.</span>
            <div style={{
              width: '4px',
              height: '4px',
              backgroundColor: '#60a5fa',
              borderRadius: '50%'
            }} />
            <span style={{ color: '#60a5fa' }}>Pioneering Sustainable Navigation</span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            {[
              'Privacy Policy',
              'Terms of Service',
              'Cookie Policy',
              'Security Center',
              'Compliance'
            ].map((link, index) => (
              <a
                key={index}
                href="#"
                style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  transition: 'color 0.3s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
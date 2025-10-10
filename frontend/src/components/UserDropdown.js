import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdPerson, MdLogout, MdKeyboardArrowDown, MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      // User will be redirected to login page automatically
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete account';
      toast.error(message);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setIsOpen(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          borderRadius: '8px',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div style={{
          height: '32px',
          width: '32px',
          background: 'linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <span style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'white',
            margin: 0
          }}>{user.name}</p>
          <p style={{
            fontSize: '12px',
            color: '#bfdbfe',
            margin: 0
          }}>{user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1) || 'User'}</p>
        </div>
        <MdKeyboardArrowDown 
          size={16}
          style={{
            color: 'white',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: '8px',
          width: '224px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb',
          padding: '8px 0',
          zIndex: 50
        }}>
          {/* User Info Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#111827',
              margin: 0
            }}>{user.name}</p>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '4px 0 0 0'
            }}>{user.email}</p>
            <div style={{ marginTop: '4px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: '#dbeafe',
                color: '#1e40af'
              }}>
                {user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1) || 'User'}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ padding: '4px 0' }}>
            <button
              onClick={handleProfileClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#374151',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <MdPerson size={16} style={{ marginRight: '12px', color: '#9ca3af' }} />
              View Profile
            </button>
            
            <div style={{
              borderTop: '1px solid #f3f4f6',
              margin: '4px 0'
            }}></div>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#dc2626',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <MdDelete size={16} style={{ marginRight: '12px', color: '#ef4444' }} />
              Delete Account
            </button>
            
            <div style={{
              borderTop: '1px solid #f3f4f6',
              margin: '4px 0'
            }}></div>
            
            <button
              onClick={handleLogoutClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <MdLogout size={16} style={{ marginRight: '12px', color: '#9ca3af' }} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            maxWidth: '400px',
            width: '100%',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              margin: '0 auto 16px auto',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MdDelete size={24} style={{ color: '#dc2626' }} />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0 0 8px 0'
            }}>
              Delete Account
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 24px 0',
              lineHeight: '1.5'
            }}>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: deleteLoading ? '#9ca3af' : '#dc2626',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: deleteLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!deleteLoading) {
                    e.currentTarget.style.backgroundColor = '#b91c1c';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!deleteLoading) {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }
                }}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;


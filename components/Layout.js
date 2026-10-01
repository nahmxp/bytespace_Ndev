import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import GoogleTranslate from './GoogleTranslate';
import { useAuth } from '../lib/AuthContext';

export default function Layout({ children }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const [showCookieWarning, setShowCookieWarning] = useState(false);
  
  console.log('user:', user);
  // Force re-render of navigation when authentication status changes
  const [navKey, setNavKey] = useState(0);
  
  useEffect(() => {
    // Update navigation key when auth state changes
    setNavKey(prevKey => prevKey + 1);
  }, [isAuthenticated, isAdmin, user]);

  // Check if cookies are enabled
  useEffect(() => {
    try {
      document.cookie = 'testcookie=1; SameSite=Strict';
      if (document.cookie.indexOf('testcookie=1') === -1) {
        setShowCookieWarning(true);
      }
      // Clean up test cookie
      document.cookie = 'testcookie=1; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch {
      setShowCookieWarning(true);
    }
  }, []);
  
  // Function to check if a path is active
  const isActive = (path) => {
    return router.pathname === path ? 'active' : '';
  };
  
  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };
  
  // Prevent rendering header navigation before auth state is determined
  if (loading) {
    return (
      <div className="layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    // Close admin dropdown if open
    if (adminDropdownOpen) setAdminDropdownOpen(false);
  };
  
  const toggleAdminDropdown = () => {
    setAdminDropdownOpen(!adminDropdownOpen);
    // Close profile dropdown if open
    if (profileDropdownOpen) setProfileDropdownOpen(false);
  };

  return (
    <div>
      {showCookieWarning && (
        <div className="cookie-warning-modal">
          <div className="cookie-warning-content">
            <h3>Cookies Required</h3>
            <p>
              This site requires cookies to keep you logged in and provide a secure shopping experience.<br />
              Please enable cookies in your browser settings and disable any extensions that block cookies.
            </p>
            <button className="btn-primary" onClick={() => setShowCookieWarning(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      <header className="main-header">
        <div className="container">
          <div className="logo">
            <Link href="/home">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>URS</span>
              </div>
            </Link>
          </div>
          

          
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          
          <nav key={navKey} className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <ul>
              {isAuthenticated && (
                <li className={isActive('/dashboard')}>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                </li>
              )}
              {isAuthenticated && isAdmin && (
                <li className={`admin-dropdown ${adminDropdownOpen ? 'open' : ''}`}>
                  <button 
                    onClick={() => {
                      toggleAdminDropdown();
                      setMobileMenuOpen(false);
                    }}
                    className="admin-dropdown-toggle"
                  >
                    <span className="admin-icon">👑</span>
                    Admin Options
                    <span className="dropdown-arrow">{adminDropdownOpen ? '▲' : '▼'}</span>
                  </button>
                  {adminDropdownOpen && (
                    <ul className="admin-dropdown-menu">
                      <li className={isActive('/all-users')}>
                        <Link href="/all-users" onClick={() => {
                          setAdminDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}>
                          Manage Users
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              )}
            </ul>
          </nav>
          
          <div className="header-actions">
            <GoogleTranslate />
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="user-profile">
                <button 
                  className="profile-button" 
                  onClick={toggleProfileDropdown}
                  aria-label="User profile"
                >
                  <span className="user-initial">{user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}</span>
                  <span className="user-name">{user?.name || user?.username}</span>
                  {isAdmin && <span className="admin-badge" title="Administrator">Admin</span>}
                </button>
                
                {profileDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-header">
                      <p className="profile-name">{user?.name}</p>
                      <p className="profile-email">{user?.email}</p>
                      {isAdmin && <p className="profile-role">Administrator</p>}
                    </div>
                    <ul>
                      <li>
                        <Link href="/dashboard" onClick={() => setProfileDropdownOpen(false)}>
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link href="/profile" onClick={() => setProfileDropdownOpen(false)}>
                          Profile
                        </Link>
                      </li>
                      {isAdmin && (
                        <li className="admin-section-header">Admin Options</li>
                      )}
                      {isAdmin && (
                        <li>
                          <Link href="/all-users" onClick={() => setProfileDropdownOpen(false)}>
                            Manage Users
                          </Link>
                        </li>
                      )}
                      <li>
                        <button onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link href="/login">
                  <button className="btn-outline">Login</button>
                </Link>
                <Link href="/signup">
                  <button className="btn-primary">Sign Up</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}
      {profileDropdownOpen && <div className="dropdown-overlay" onClick={toggleProfileDropdown}></div>}
      {adminDropdownOpen && <div className="dropdown-overlay" onClick={toggleAdminDropdown}></div>}
      
      <main className="container">
        {children}
      </main>
      
      <footer className="main-footer">
        <div className="footer-container container">
          <div className="footer-top">
            <div className="footer-col footer-brand">
              <img src="/images/image.png" alt="URS Logo" className="footer-logo" />
              <p className="footer-desc">URS - Universal Registration System</p>
            </div>
            <div className="footer-col footer-links">
              <h4>Quick Links</h4>
              <ul>
              </ul>
            </div>
            <div className="footer-col footer-customer">
              <h4>Support</h4>
              <ul>
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms & Conditions</Link></li>
              </ul>
            </div>
                        <div className="footer-col footer-newsletter">
              <h4>Updates</h4>
              <p>Stay informed about system updates.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} User Management System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      <style jsx>{`
        .admin-dropdown {
          position: relative;
        }
        
        .admin-dropdown-toggle {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-color);
          font-size: 1rem;
          padding: 10px 15px;
          transition: color 0.2s;
        }
        
        .admin-dropdown-toggle:hover {
          color: var(--primary-color);
        }
        
        .admin-icon {
          margin-right: 5px;
        }
        
        .dropdown-arrow {
          font-size: 0.7rem;
          margin-left: 5px;
        }
        
        .admin-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: var(--card-bg);
          border-radius: 8px;
          box-shadow: 0 5px 15px var(--shadow-color);
          min-width: 180px;
          padding: 5px 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }
        
        .admin-dropdown-menu li {
          display: block;
          width: 100%;
          margin: 0;
        }
        
        .admin-dropdown-menu a {
          display: block;
          padding: 10px 15px;
          color: var(--text-color);
          text-decoration: none;
          transition: background-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        
        .admin-dropdown-menu a:hover {
          background-color: rgba(var(--accent-rgb), 0.1);
          color: var(--primary-color);
        }
        
        .admin-section-header {
          font-size: 0.8rem;
          font-weight: bold;
          color: var(--text-muted);
          padding: 10px 15px 5px;
          border-top: 1px solid var(--border-color);
          margin-top: 5px;
        }
        
        @media (max-width: 768px) {
          .admin-dropdown-menu {
            position: static;
            box-shadow: none;
            background: transparent;
            padding-left: 15px;
          }
        }
      `}</style>
    </div>
  );
} 
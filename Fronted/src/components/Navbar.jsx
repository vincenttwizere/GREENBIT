import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/greenbit-logo.png';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-header">
      {/* Top bar: green strip with contact info + Join Us Now */}
      <div className="navbar-top-bar">
        <div className="navbar-top-content">
          <span className="navbar-contact">Phone: +1 (555) 123-4567</span>
          <span className="navbar-contact">Email: partnerships@greenbit.org</span>
          {!user && (
            <button onClick={handleJoinClick} className="navbar-join-now">
              JOIN US NOW
            </button>
          )}
        </div>
      </div>

      {/* Main nav: white strip with logo + links */}
      <nav className="navbar-main">
        <div className="navbar-main-content">
          <div className="navbar-brand">
            <img src={logo} alt="Green Bit Foundation logo" className="navbar-logo-image" />
            <div className="navbar-brand-text">
              <span className="navbar-logo-name">GREENBIT</span>
              <span className="navbar-tagline">For impact</span>
            </div>
          </div>

          <button
            className="navbar-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="navbar-toggle-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  open
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                }
              />
            </svg>
          </button>

          <div className="navbar-desktop">
            <div className="navbar-links">
              <a href="#home" className="navbar-link">HOME</a>
              <a href="#services" className="navbar-link">SERVICES</a>
              <a href="#about" className="navbar-link">ABOUT US</a>
              <a href="#contact" className="navbar-link">CONTACT US</a>
            </div>
            {user && (
              <div className="navbar-auth">
                <span className="navbar-auth-text">
                  Signed in as <span className="navbar-auth-name">{user.name}</span>
                </span>
                <button onClick={handleLogout} className="navbar-auth-logout">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {open && (
        <div className="navbar-mobile-wrapper">
          <div className="navbar-mobile">
            <a href="#home" className="navbar-link navbar-link-mobile" onClick={() => setOpen(false)}>HOME</a>
            <a href="#services" className="navbar-link navbar-link-mobile" onClick={() => setOpen(false)}>SERVICES</a>
            <a href="#about" className="navbar-link navbar-link-mobile" onClick={() => setOpen(false)}>ABOUT US</a>
            <a href="#contact" className="navbar-link navbar-link-mobile" onClick={() => setOpen(false)}>CONTACT US</a>
            {user ? (
              <div className="navbar-mobile-auth">
                <span className="navbar-mobile-user">{user.name} ({user.role})</span>
                <button onClick={() => { setOpen(false); handleLogout(); }} className="navbar-auth-logout">
                  Logout
                </button>
              </div>
            ) : (
              <div className="navbar-mobile-auth">
                <Link to="/login" onClick={() => setOpen(false)} className="navbar-mobile-signin">Sign in</Link>
                <button onClick={() => { setOpen(false); handleJoinClick(); }} className="navbar-join-now navbar-join-now-mobile">
                  JOIN US NOW
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


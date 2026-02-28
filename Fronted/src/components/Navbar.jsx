import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

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
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo-text">
            GREENBIT
          </span>
          <span className="navbar-tagline">
            Food redistribution for impact.
          </span>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-5 w-5"
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
            <a href="#home" className="navbar-link">
              Home
            </a>
            <a href="#about" className="navbar-link">
              About Us
            </a>
            <a href="#services" className="navbar-link">
              Services
            </a>
            <a href="#contact" className="navbar-link">
              Contact
            </a>
          </div>
          <div className="navbar-auth">
            {user ? (
              <>
                <span className="navbar-auth-text">
                  Signed in as <span className="navbar-auth-name">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="navbar-auth-logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="navbar-signin"
                >
                  Sign in
                </Link>
                <button
                  onClick={handleJoinClick}
                  className="navbar-join"
                >
                  Join Us
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {open && (
        <div className="navbar-mobile-wrapper">
          <div className="navbar-mobile">
            <a href="#home" className="navbar-link" onClick={() => setOpen(false)}>
              Home
            </a>
            <a href="#about" className="navbar-link" onClick={() => setOpen(false)}>
              About Us
            </a>
            <a href="#services" className="navbar-link" onClick={() => setOpen(false)}>
              Services
            </a>
            <a href="#contact" className="navbar-link" onClick={() => setOpen(false)}>
              Contact
            </a>
            <div className="navbar-mobile-auth">
              {user ? (
                <>
                  <span className="navbar-mobile-user">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="navbar-auth-logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="navbar-signin"
                  >
                    Sign in
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleJoinClick();
                    }}
                    className="navbar-join"
                  >
                    Join Us
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import logo from '../assets/greenbit-logo.png';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications/unread-count').catch(() => ({ data: { count: 0 } }));
        setUnreadCount(res.data?.count || 0);
      } catch (err) {
        console.error('Failed to fetch notification count:', err);
      }
    };
    
    if (user?.id) {
      fetchNotifications();
      // Poll for new notifications every 10 seconds
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const isActive = (path) => location.pathname.startsWith(path);

  const { logout } = useAuth();
  const links = [];
  const utilityLinks = [];

  // Role-specific links
  if (user?.role === 'restaurant') {
    links.push(
      { label: 'Dashboard', to: '/dashboard/restaurant', icon: '🏠' },
      { label: 'Add Surplus', to: '/dashboard/restaurant#add-surplus', icon: '➕' },
      { label: 'Active Listings', to: '/dashboard/restaurant#listings', icon: '📦' },
      { label: 'Pickup Tracking', to: '/dashboard/restaurant#tracking', icon: '📍' },
      { label: 'Notifications', to: '/dashboard/restaurant#notifications', icon: '🔔', badge: unreadCount },
      { label: 'History', to: '/dashboard/restaurant#history', icon: '📊' },
      { label: 'Profile', to: '/dashboard/restaurant#profile', icon: '👤' }
    );
  }
  if (user?.role === 'collector') {
    links.push(
      { label: 'Dashboard', to: '/dashboard/collector', icon: '🏠' },
      { label: 'Available Pickups', to: '/dashboard/collector#available', icon: '📋' },
      { label: 'Active Pickups', to: '/dashboard/collector#active', icon: '🚚' },
      { label: 'Notifications', to: '/dashboard/collector#notifications', icon: '🔔', badge: unreadCount },
      { label: 'History', to: '/dashboard/collector#history', icon: '📊' },
      { label: 'Profile', to: '/dashboard/collector#profile', icon: '👤' }
    );
  }
  if (user?.role === 'admin') {
    links.push(
      { label: 'Dashboard', to: '/dashboard/admin', icon: '📊' },
      { label: 'Donors', to: '/dashboard/admin#donors', icon: '🏪' },
      { label: 'Collectors', to: '/dashboard/admin#collectors', icon: '👥' },
      { label: 'Listings', to: '/dashboard/admin#listings', icon: '📦' },
      { label: 'Notifications', to: '/dashboard/admin#notifications', icon: '🔔', badge: unreadCount },
      { label: 'Reports', to: '/dashboard/admin#reports', icon: '📈' },
      { label: 'Settings', to: '/dashboard/admin#settings', icon: '⚙️' }
    );
  }

  // Utility links for all users
  utilityLinks.push(
    { label: 'Settings', to: '#settings', icon: '⚙️', isutility: true },
    { label: 'Help', to: '#help', icon: '❓', isutility: true }
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="logo" className="sidebar-logo" />
        <h1 className="sidebar-title">GREENBIT</h1>
      </div>
      <nav className="sidebar-nav">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`sidebar-link ${isActive(l.to) ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{l.icon}</span>
            <span className="sidebar-link-text">{l.label}</span>
            {l.badge && l.badge > 0 && (
              <span className="sidebar-link-badge">{l.badge}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Utility Links Section */}
      {utilityLinks.length > 0 && (
        <nav className="sidebar-utilities">
          {utilityLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`sidebar-link ${isActive(l.to) ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">{l.icon}</span>
              <span className="sidebar-link-text">{l.label}</span>
            </Link>
          ))}
        </nav>
      )}
      {user && (
        <div className="sidebar-footer">
          <span className="sidebar-user">
            {user.name} ({user.role})
          </span>
          <button onClick={logout} className="sidebar-logout">
            Logout
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/greenbit-logo.png';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const { logout } = useAuth();
  const links = [];
  if (user?.role === 'restaurant') {
    links.push({ label: 'Dashboard', to: '/dashboard/restaurant', icon: '🏠' });
  }
  if (user?.role === 'collector') {
    links.push({ label: 'Dashboard', to: '/dashboard/collector', icon: '🚚' });
  }
  if (user?.role === 'admin') {
    links.push({ label: 'Dashboard', to: '/dashboard/admin', icon: '🛠️' });
  }

  // common links could go here

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
          </Link>
        ))}
      </nav>
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

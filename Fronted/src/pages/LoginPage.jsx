import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state && location.state.from) || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);

      if (data.user.role === 'restaurant') {
        navigate('/dashboard/restaurant', { replace: true });
      } else if (data.user.role === 'collector') {
        navigate('/dashboard/collector', { replace: true });
      } else if (data.user.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Unable to sign in. Please check your details.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-auth">
      <Navbar />
      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">
            Access your Green Bit dashboard to track surplus, pickups, and impact.
          </p>
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <label
                htmlFor="email"
                className="auth-label"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="auth-label"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="auth-submit"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="auth-footer-text">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-footer-link">
              Create one
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;


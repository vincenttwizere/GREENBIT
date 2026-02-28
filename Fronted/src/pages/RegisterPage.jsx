import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'restaurant',
    location: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role');
    if (role && ['restaurant', 'collector'].includes(role)) {
      setForm((prev) => ({ ...prev, role }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form };
      const { data } = await api.post('/auth/register', payload);
      login(data.user, data.token);

      if (data.user.role === 'restaurant') {
        navigate('/dashboard/restaurant', { replace: true });
      } else if (data.user.role === 'collector') {
        navigate('/dashboard/collector', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Unable to register. Please try again later.';
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
          <h1 className="auth-title">Join Green Bit</h1>
          <p className="auth-subtitle">
            Create an account as a restaurant or collector to start redistributing surplus
            food.
          </p>
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <label
                htmlFor="name"
                className="auth-label"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>
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
            <div className="auth-grid-two">
              <div>
                <label
                  htmlFor="role"
                  className="auth-label"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="auth-input"
                >
                  <option value="restaurant">Restaurant / Hotel</option>
                  <option value="collector">Collector</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="auth-label"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="City / Area"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="auth-submit"
            >
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-footer-link">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;


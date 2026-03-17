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
    address: '',
    contactNumber: '',
    foodType: '',
    operatingHours: '',
    businessLicenseFile: null,
    registrationDocFile: null,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role');
    if (role && ['restaurant', 'collector', 'admin'].includes(role)) {
      setForm((prev) => ({ ...prev, role }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files?.[0] || null }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('role', form.role);
      formData.append('location', form.location);

      if (form.role === 'restaurant') {
        formData.append('address', form.address);
        formData.append('contactNumber', form.contactNumber);
        formData.append('foodType', form.foodType);
        formData.append('operatingHours', form.operatingHours);

        if (form.businessLicenseFile) {
          formData.append('businessLicense', form.businessLicenseFile);
        }
        if (form.registrationDocFile) {
          formData.append('registrationDoc', form.registrationDocFile);
        }
      }

      const { data } = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

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
            Create an account as a restaurant, collector, or admin to start managing surplus food.
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
                  <option value="admin">Admin</option>
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

            {form.role === 'restaurant' && (
              <> 
                <div>
                  <label htmlFor="address" className="auth-label">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="Street address"
                    required
                  />
                </div>
                <div className="auth-grid-two">
                  <div>
                    <label htmlFor="contactNumber" className="auth-label">
                      Contact Number
                    </label>
                    <input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      value={form.contactNumber}
                      onChange={handleChange}
                      className="auth-input"
                      placeholder="+123 456 7890"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="foodType" className="auth-label">
                      Type of Food
                    </label>
                    <input
                      id="foodType"
                      name="foodType"
                      type="text"
                      value={form.foodType}
                      onChange={handleChange}
                      className="auth-input"
                      placeholder="e.g. Cooked, Bakery, Produce"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="operatingHours" className="auth-label">
                    Operating Hours
                  </label>
                  <input
                    id="operatingHours"
                    name="operatingHours"
                    type="text"
                    value={form.operatingHours}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="e.g. 08:00 - 18:00"
                    required
                  />
                </div>

                <div className="auth-grid-two">
                  <div>
                    <label htmlFor="businessLicenseFile" className="auth-label">
                      Business license
                    </label>
                    <input
                      id="businessLicenseFile"
                      name="businessLicenseFile"
                      type="file"
                      onChange={handleChange}
                      className="auth-input"
                      accept="image/*,application/pdf"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="registrationDocFile" className="auth-label">
                      Registration document
                    </label>
                    <input
                      id="registrationDocFile"
                      name="registrationDocFile"
                      type="file"
                      onChange={handleChange}
                      className="auth-input"
                      accept="image/*,application/pdf"
                      required
                    />
                  </div>
                </div>
              </>
            )}

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


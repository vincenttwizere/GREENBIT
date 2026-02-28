import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/axios.js';

const RestaurantDashboard = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    quantity: '',
    expiryTime: '',
    pickupDeadline: '',
  });
  const [surpluses, setSurpluses] = useState([]);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, iRes] = await Promise.all([
        api.get('/restaurant/surplus'),
        api.get('/restaurant/impact'),
      ]);
      setSurpluses(sRes.data || []);
      setImpact(iRes.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        quantity: parseFloat(form.quantity || '0'),
      };
      await api.post('/restaurant/surplus', payload);
      setForm({
        title: '',
        description: '',
        quantity: '',
        expiryTime: '',
        pickupDeadline: '',
      });
      showToast('Surplus reported successfully.');
      await fetchData();
    } catch (err) {
      console.error(err);
      showToast('Failed to report surplus. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-dashboard">
      <Navbar />
      <main className="dashboard-main">
        {toast && (
          <div className="dashboard-toast">
            {toast}
          </div>
        )}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Restaurant Dashboard</h1>
            <p className="dashboard-subtitle">
              Report surplus food and track your environmental impact.
            </p>
          </div>
        </div>

        <div className="dashboard-grid-wide">
          <section className="dashboard-card">
            <h2 className="dashboard-card-title">
              Report Surplus Food
            </h2>
            <p className="dashboard-card-help">
              Provide details about your surplus. Verified collectors will be assigned
              automatically.
            </p>
            <form onSubmit={handleSubmit} className="dashboard-form">
              <div>
                <label className="dashboard-label">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="dashboard-input"
                />
              </div>
              <div>
                <label className="dashboard-label">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="dashboard-input dashboard-textarea"
                />
              </div>
              <div className="dashboard-grid-two">
                <div>
                  <label className="dashboard-label">
                    Quantity (kg)
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    step="0.1"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    className="dashboard-input"
                  />
                </div>
                <div>
                  <label className="dashboard-label">
                    Expiry Time
                  </label>
                  <input
                    name="expiryTime"
                    type="datetime-local"
                    value={form.expiryTime}
                    onChange={handleChange}
                    required
                    className="dashboard-input"
                  />
                </div>
              </div>
              <div>
                <label className="dashboard-label">
                  Pickup Deadline
                </label>
                <input
                  name="pickupDeadline"
                  type="datetime-local"
                  value={form.pickupDeadline}
                  onChange={handleChange}
                  required
                  className="dashboard-input"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="dashboard-primary-button"
              >
                {submitting ? 'Submitting...' : 'Report Surplus'}
              </button>
            </form>
          </section>

          <section className="dashboard-right">
            <div className="dashboard-metrics-grid">
              <div className="dashboard-metric-card">
                <p className="dashboard-metric-label">
                  Total Quantity
                </p>
                <p className="dashboard-metric-value">
                  {impact ? impact.totalQuantity.toFixed(1) : '0.0'} kg
                </p>
              </div>
              <div className="dashboard-metric-card">
                <p className="dashboard-metric-label">
                  Meals Served
                </p>
                <p className="dashboard-metric-value">
                  {impact ? impact.meals.toFixed(0) : '0'}
                </p>
              </div>
              <div className="dashboard-metric-card">
                <p className="dashboard-metric-label">
                  CO₂ Saved
                </p>
                <p className="dashboard-metric-value">
                  {impact ? impact.co2Saved.toFixed(1) : '0.0'} kg
                </p>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">Surplus List</h2>
              </div>
              {loading ? (
                <p className="dashboard-empty-text">Loading surpluses...</p>
              ) : surpluses.length === 0 ? (
                <p className="dashboard-empty-text">
                  No surplus reported yet. Start by reporting your first batch.
                </p>
              ) : (
                <div className="dashboard-list">
                  {surpluses.map((s) => (
                    <div
                      key={s.id}
                      className="dashboard-list-item dashboard-list-item-surplus"
                    >
                      <div>
                        <p className="dashboard-list-title">{s.title}</p>
                        <p className="dashboard-list-meta">
                          {s.quantity.toFixed(1)} kg · Expires{' '}
                          {new Date(s.expiryTime).toLocaleString()}
                        </p>
                      </div>
                      <div className="dashboard-list-right">
                        <StatusBadge status={s.status} />
                        {s.assignedCollectorId && (
                          <span className="text-[11px] text-slate-600">
                            Assigned collector #{s.assignedCollectorId}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantDashboard;


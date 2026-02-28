import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/axios.js';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [surpluses, setSurpluses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uRes, sRes, aRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/surplus'),
        api.get('/admin/analytics'),
      ]);
      setUsers(uRes.data || []);
      setSurpluses(sRes.data || []);
      setAnalytics(aRes.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id) => {
    try {
      await api.put(`/admin/verify/${id}`);
      showToast('Collector verified successfully.');
      await fetchData();
    } catch (err) {
      console.error(err);
      showToast('Failed to verify user.');
    }
  };

  const chartData = useMemo(() => {
    if (!analytics) return null;
    const { meals, co2Saved, totalDeliveries } = analytics;
    const max = Math.max(meals || 1, co2Saved || 1, totalDeliveries || 1);
    return {
      mealsWidth: `${(meals / max) * 100}%`,
      co2Width: `${(co2Saved / max) * 100}%`,
      deliveriesWidth: `${(totalDeliveries / max) * 100}%`,
    };
  }, [analytics]);

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
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Verify users, monitor surplus flows, and track overall impact.
            </p>
          </div>
        </div>

        <section className="admin-metrics-grid">
          <div className="dashboard-metric-card">
            <p className="dashboard-metric-label">
              Total Food Saved
            </p>
            <p className="dashboard-metric-value">
              {analytics ? analytics.totalQuantity.toFixed(1) : '0.0'} kg
            </p>
          </div>
          <div className="dashboard-metric-card">
            <p className="dashboard-metric-label">
              Total Deliveries
            </p>
            <p className="dashboard-metric-value">
              {analytics ? analytics.totalDeliveries : '0'}
            </p>
          </div>
          <div className="dashboard-metric-card">
            <p className="dashboard-metric-label">
              Total CO₂ Saved
            </p>
            <p className="dashboard-metric-value">
              {analytics ? analytics.co2Saved.toFixed(1) : '0.0'} kg
            </p>
          </div>
          <div className="dashboard-metric-card">
            <p className="dashboard-metric-label">
              Active Users
            </p>
            <p className="dashboard-metric-value">
              {analytics ? analytics.activeUsers : '0'}
            </p>
          </div>
        </section>

        <section className="dashboard-card admin-impact-card">
          <h2 className="dashboard-card-title">
            Impact Overview (Simple Chart)
          </h2>
          <p className="dashboard-card-help">
            Visual snapshot of meals served, CO₂ saved, and total deliveries.
          </p>
          {analytics && chartData ? (
            <div className="admin-chart">
              <div>
                <div className="admin-chart-row">
                  <span>Meals Served</span>
                  <span>{analytics.meals.toFixed(0)}</span>
                </div>
                <div className="admin-chart-bar-bg">
                  <div
                    className="admin-chart-bar admin-chart-bar-meals"
                    style={{ width: chartData.mealsWidth }}
                  />
                </div>
              </div>
              <div>
                <div className="admin-chart-row">
                  <span>CO₂ Saved (kg)</span>
                  <span>{analytics.co2Saved.toFixed(1)}</span>
                </div>
                <div className="admin-chart-bar-bg">
                  <div
                    className="admin-chart-bar admin-chart-bar-co2"
                    style={{ width: chartData.co2Width }}
                  />
                </div>
              </div>
              <div>
                <div className="admin-chart-row">
                  <span>Total Deliveries</span>
                  <span>{analytics.totalDeliveries}</span>
                </div>
                <div className="admin-chart-bar-bg">
                  <div
                    className="admin-chart-bar admin-chart-bar-deliveries"
                    style={{ width: chartData.deliveriesWidth }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="dashboard-empty-text">
              Impact data will appear here once deliveries are completed.
            </p>
          )}
        </section>

        <div className="admin-bottom-grid">
          <section className="dashboard-card">
            <h2 className="dashboard-card-title">Manage Users</h2>
            <p className="dashboard-card-help">
              Verify collectors and monitor user roles across the platform.
            </p>
            {loading ? (
              <p className="dashboard-empty-text">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="dashboard-empty-text">No users found.</p>
            ) : (
              <div className="dashboard-list">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="dashboard-list-item dashboard-list-item-history"
                  >
                    <div>
                      <p className="dashboard-list-title">{u.name}</p>
                      <p className="dashboard-list-meta">
                        {u.email} ·{' '}
                        <span className="capitalize text-[var(--color-green-dark)]">
                          {u.role}
                        </span>
                      </p>
                    </div>
                    <div className="dashboard-list-right">
                      {u.role === 'collector' && !u.verified && (
                        <button
                          onClick={() => handleVerify(u.id)}
                          className="dashboard-chip-button"
                        >
                          Verify
                        </button>
                      )}
                      <span className={`admin-verify-pill ${u.verified ? 'admin-verify-pill--ok' : 'admin-verify-pill--pending'}`}>
                        {u.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-card">
            <h2 className="dashboard-card-title">Monitor Surplus</h2>
            <p className="dashboard-card-help">
              Track surplus reports across all restaurants on the network.
            </p>
            {loading ? (
              <p className="dashboard-empty-text">Loading surplus records...</p>
            ) : surpluses.length === 0 ? (
              <p className="dashboard-empty-text">No surplus records found.</p>
            ) : (
              <div className="dashboard-list admin-surplus-list">
                {surpluses.map((s) => (
                  <div
                    key={s.id}
                    className="dashboard-list-item dashboard-list-item-history"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        #{s.id} · {s.title}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        {s.quantity.toFixed(1)} kg · Restaurant #{s.restaurantId}
                      </p>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;


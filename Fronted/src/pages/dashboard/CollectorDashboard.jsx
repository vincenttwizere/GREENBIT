import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const CollectorDashboard = () => {
  const { user } = useAuth();
  const [available, setAvailable] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aRes, hRes] = await Promise.all([
        api.get('/collector/available'),
        api.get('/collector/history'),
      ]);
      setAvailable(aRes.data || []);
      setHistory(hRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assigned = useMemo(
    () => available.filter((s) => s.assignedCollectorId === user?.id),
    [available, user?.id]
  );

  const openPickups = useMemo(
    () => available.filter((s) => s.status === 'pending'),
    [available]
  );

  const handleAction = async (type, id) => {
    try {
      let endpoint = '';
      if (type === 'accept') endpoint = `/collector/accept/${id}`;
      if (type === 'pickup') endpoint = `/collector/pickup/${id}`;
      if (type === 'deliver') endpoint = `/collector/deliver/${id}`;

      const { data } = await api.post(endpoint);
      if (type === 'deliver' && data.impact) {
        showToast(
          `Delivery confirmed. Meals: ${data.impact.meals}, CO₂ saved: ${data.impact.co2Saved.toFixed(
            1
          )}kg`
        );
      } else {
        showToast('Status updated successfully.');
      }
      await fetchData();
    } catch (err) {
      console.error(err);
      showToast('Action failed. Please try again.');
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
            <h1 className="dashboard-title">Collector Dashboard</h1>
            <p className="dashboard-subtitle">
              View available pickups, confirm collection, and log deliveries.
            </p>
          </div>
        </div>

        <div className="dashboard-grid-two-equal">
          <section className="dashboard-card">
            <h2 className="dashboard-card-title">Available Pickups</h2>
            <p className="dashboard-card-help">
              Accept new surplus collections in your area.
            </p>
            {loading ? (
              <p className="dashboard-empty-text">Loading pickups...</p>
            ) : openPickups.length === 0 ? (
              <p className="dashboard-empty-text">
                No open pickups at the moment.
              </p>
            ) : (
              <div className="dashboard-list">
                {openPickups.map((s) => (
                  <div
                    key={s.id}
                    className="dashboard-list-item"
                  >
                    <div className="dashboard-list-top">
                      <div>
                        <p className="dashboard-list-title">{s.title}</p>
                        <p className="dashboard-list-meta">
                          {s.quantity.toFixed(1)} kg · Expires{' '}
                          {new Date(s.expiryTime).toLocaleString()}
                        </p>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                    <button onClick={() => handleAction('accept', s.id)} className="dashboard-chip-button">
                      Accept Pickup
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-card">
            <h2 className="dashboard-card-title">Assigned Pickups</h2>
            <p className="dashboard-card-help">
              Confirm pickup and delivery for your current assignments.
            </p>
            {loading ? (
              <p className="dashboard-empty-text">Loading assignments...</p>
            ) : assigned.length === 0 ? (
              <p className="dashboard-empty-text">
                You have no assigned pickups right now.
              </p>
            ) : (
              <div className="dashboard-list">
                {assigned.map((s) => (
                  <div
                    key={s.id}
                    className="dashboard-list-item"
                  >
                    <div className="dashboard-list-top">
                      <div>
                        <p className="dashboard-list-title">{s.title}</p>
                        <p className="dashboard-list-meta">
                          {s.quantity.toFixed(1)} kg · Pickup by{' '}
                          {new Date(s.pickupDeadline).toLocaleString()}
                        </p>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                    <div className="dashboard-actions-row">
                      {s.status === 'assigned' && (
                        <button onClick={() => handleAction('pickup', s.id)} className="dashboard-chip-button dashboard-chip-purple">
                          Confirm Pickup
                        </button>
                      )}
                      {s.status === 'picked_up' && (
                        <button onClick={() => handleAction('deliver', s.id)} className="dashboard-chip-button">
                          Confirm Delivery
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="dashboard-card dashboard-history">
          <h2 className="dashboard-card-title">Delivery History</h2>
          <p className="dashboard-card-help">
            A record of your completed and in-progress deliveries.
          </p>
          {loading ? (
            <p className="dashboard-empty-text">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="dashboard-empty-text">No deliveries recorded yet.</p>
          ) : (
            <div className="dashboard-list dashboard-list-history">
              {history.map((d) => (
                <div
                  key={d.id}
                  className="dashboard-list-item dashboard-list-item-history"
                >
                  <div>
                    <p className="dashboard-list-title">
                      Surplus #{d.surplusId}
                    </p>
                    <p className="dashboard-list-meta">
                      Pickup: {d.pickupTime && new Date(d.pickupTime).toLocaleString()}
                      {' · '}
                      Delivery:{' '}
                      {d.deliveryTime
                        ? new Date(d.deliveryTime).toLocaleString()
                        : 'In progress'}
                    </p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CollectorDashboard;


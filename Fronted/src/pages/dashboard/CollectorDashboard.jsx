import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const CollectorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [available, setAvailable] = useState([]);
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [impact, setImpact] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aRes, hRes, pRes, iRes, nRes] = await Promise.all([
        api.get('/collector/available').catch(() => ({ data: [] })),
        api.get('/collector/history').catch(() => ({ data: [] })),
        api.get('/collector/profile').catch(() => ({ data: null })),
        api.get('/collector/impact').catch(() => ({ data: null })),
        api.get('/collector/notifications').catch(() => ({ data: [] })),
      ]);
      setAvailable(aRes.data || []);
      setHistory(hRes.data || []);
      setProfile(pRes.data || null);
      setImpact(iRes.data || null);
      setNotifications(nRes.data || []);
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
    () => available.filter((s) => s.assignedCollectorId === user?.id && s.status !== 'completed'),
    [available, user?.id]
  );

  const openPickups = useMemo(
    () => available.filter((s) => s.status === 'pending'),
    [available]
  );

  const activePickups = useMemo(
    () => available.filter((s) => s.status === 'assigned' || s.status === 'picked_up'),
    [available]
  );

  const filteredOpenPickups = useMemo(() => {
    if (!searchTerm) return openPickups;
    return openPickups.filter((s) =>
      s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.foodCategory?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [openPickups, searchTerm]);

  const filteredActivePickups = useMemo(() => {
    if (!searchTerm) return activePickups;
    return activePickups.filter((s) =>
      s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.foodCategory?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activePickups, searchTerm]);

  const calculateExpiryCountdown = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diffMs = expiry - now;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 0) return 'Expired';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  };

  const handleAction = async (type, id) => {
    try {
      let endpoint = '';
      if (type === 'accept') endpoint = `/collector/accept/${id}`;
      if (type === 'pickup') endpoint = `/collector/pickup/${id}`;
      if (type === 'deliver') endpoint = `/collector/deliver/${id}`;

      const { data } = await api.post(endpoint);
      if (type === 'deliver' && data.impact) {
        showToast(
          `✓ Delivery confirmed. Meals: ${data.impact.meals}, CO₂ saved: ${data.impact.co2Saved.toFixed(1)}kg`
        );
      } else {
        showToast('✓ Status updated successfully.');
      }
      await fetchData();
    } catch (err) {
      console.error(err);
      showToast('✗ Action failed. Please try again.');
    }
  };

  return (
    <div className="page-dashboard">
      <Sidebar />
      <main className="dashboard-main">
        {toast && <div className="dashboard-toast">{toast}</div>}

        <div className="dashboard-header">
          <div>
            <p className="dashboard-subtitle">Discover food rescue opportunities and track your impact</p>
          </div>
          <div className="dashboard-search-wrapper">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="dashboard-search"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Pickups
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Pickups
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-metrics-grid-4">
              <div className="dashboard-metric-card-large">
                <div className="metric-icon metric-icon-orange">🎯</div>
                <p className="dashboard-metric-label">Total Collected</p>
                <p className="dashboard-metric-value">{impact?.totalQuantity?.toFixed(1) || '0'} kg</p>
                <p className="metric-trend">Food rescued</p>
              </div>
              <div className="dashboard-metric-card-large">
                <div className="metric-icon metric-icon-blue">🍽️</div>
                <p className="dashboard-metric-label">Meals Delivered</p>
                <p className="dashboard-metric-value">{impact?.meals?.toFixed(0) || '0'}</p>
                <p className="metric-trend">People helped</p>
              </div>
              <div className="dashboard-metric-card-large">
                <div className="metric-icon metric-icon-green">♻️</div>
                <p className="dashboard-metric-label">CO₂ Savings</p>
                <p className="dashboard-metric-value">{impact?.co2Saved?.toFixed(1) || '0'} kg</p>
                <p className="metric-trend">Environmental impact</p>
              </div>
              <div className="dashboard-metric-card-large">
                <div className="metric-icon metric-icon-purple">📦</div>
                <p className="dashboard-metric-label">Active Pickups</p>
                <p className="dashboard-metric-value">{filteredActivePickups?.length || '0'}</p>
                <p className="metric-trend">In progress</p>
              </div>
            </div>

            <div className="dashboard-charts-grid" style={{ marginTop: '1.5rem' }}>
              <div className="dashboard-chart-card">
                <h3 className="dashboard-card-title">Activity Trends (Last 7 Days)</h3>
                <div className="chart-placeholder">Chart placeholder</div>
              </div>
              <div className="dashboard-chart-card">
                <h3 className="dashboard-card-title">Top Routes</h3>
                <div className="chart-placeholder">Chart placeholder</div>
              </div>
            </div>

            <div className="dashboard-grid-two">
              <div className="dashboard-card">
                <h3 className="dashboard-card-title">Quick Stats</h3>
                <p className="dashboard-card-help">Your collection activity</p>
                <div className="simple-stats">
                  <div className="stat-row">
                    <span>Pending Pickups</span>
                    <span className="stat-value">{filteredOpenPickups?.length || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span>My Active Assignments</span>
                    <span className="stat-value">{assigned?.length || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span>This Month Collections</span>
                    <span className="stat-value">{history?.length || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span>Verification Status</span>
                    <span className="stat-value">{user?.verified ? '✓ Verified' : '⏳ Pending'}</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3 className="dashboard-card-title">Impact Badges</h3>
                <p className="dashboard-card-help">Your achievements on the platform</p>
                <div className="badges-grid">
                  <div className="badge-item">
                    <div className="badge-icon">🥉</div>
                    <div className="badge-info">
                      <p className="badge-name">Bronze Collector</p>
                      <p className="badge-desc">50+ kg collected</p>
                    </div>
                  </div>
                  <div className="badge-item">
                    <div className="badge-icon" style={{ opacity: 0.3 }}>🥈</div>
                    <div className="badge-info">
                      <p className="badge-name">Silver Collector</p>
                      <p className="badge-desc">500+ kg collected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AVAILABLE PICKUPS TAB */}
        {activeTab === 'available' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-card">
              <p className="dashboard-card-help">Browse nearby food rescue opportunities</p>
              {loading ? (
                <p className="dashboard-empty-text">Loading pickups...</p>
              ) : filteredOpenPickups.length === 0 ? (
                <p className="dashboard-empty-text">No open pickups available right now. Check back soon!</p>
              ) : (
                <div className="pickups-grid">
                  {filteredOpenPickups.map((s) => (
                    <div key={s.id} className="pickup-card">
                      <div className="pickup-card-header">
                        <h4>{s.title}</h4>
                        <span className={`countdown-badge countdown-badge-${calculateExpiryCountdown(s.expiryTime) === 'Expired' ? 'red' : 'yellow'}`}>
                          {calculateExpiryCountdown(s.expiryTime)} left
                        </span>
                      </div>
                      <div className="pickup-card-details">
                        <p className="pickup-detail"><strong>Quantity:</strong> {s.quantity} {s.quantityUnit || 'kg'}</p>
                        <p className="pickup-detail"><strong>Category:</strong> {s.foodCategory || 'Mixed'}</p>
                        <p className="pickup-detail"><strong>Storage:</strong> {s.storageType || 'Room Temp'}</p>
                        <p className="pickup-detail"><strong>Expires:</strong> {new Date(s.expiryTime).toLocaleTimeString()}</p>
                        {s.specialInstructions && (
                          <p className="pickup-detail"><strong>Notes:</strong> {s.specialInstructions}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => handleAction('accept', s.id)}
                        className="pickup-card-btn"
                      >
                        ✓ Accept this pickup
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACTIVE PICKUPS TAB */}
        {activeTab === 'active' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-card">
              <p className="dashboard-card-help">Track your assigned pickups and mark progress</p>
              {loading ? (
                <p className="dashboard-empty-text">Loading assignments...</p>
              ) : filteredActivePickups.length === 0 ? (
                <p className="dashboard-empty-text">No active pickups assigned right now.</p>
              ) : (
                <div className="tracking-list">
                  {filteredActivePickups.map((s) => (
                    <div key={s.id} className="tracking-card">
                      <div className="tracking-header">
                        <h4>{s.title}</h4>
                        <StatusBadge status={s.status} />
                      </div>
                      <div className="tracking-details">
                        <div className="tracking-detail-row">
                          <span className="label">Quantity:</span>
                          <span className="value">{s.quantity} {s.quantityUnit || 'kg'}</span>
                        </div>
                        <div className="tracking-detail-row">
                          <span className="label">Donor Contact:</span>
                          <span className="value">Restaurant #{s.restaurantId}</span>
                        </div>
                        <div className="tracking-detail-row">
                          <span className="label">Pickup By:</span>
                          <span className="value">{new Date(s.pickupDeadline).toLocaleTimeString()}</span>
                        </div>
                        <div className="tracking-detail-row">
                          <span className="label">Expiry Timer:</span>
                          <span className={`countdown-badge countdown-badge-${calculateExpiryCountdown(s.expiryTime) === 'Expired' ? 'red' : 'yellow'}`}>
                            {calculateExpiryCountdown(s.expiryTime)}
                          </span>
                        </div>
                      </div>
                      <div className="tracking-actions">
                        {s.status === 'assigned' && (
                          <>
                            <button 
                              onClick={() => handleAction('pickup', s.id)}
                              className="tracking-btn"
                            >
                              ✓ Confirm Pickup
                            </button>
                            <button className="tracking-btn">📍 Get Directions</button>
                          </>
                        )}
                        {s.status === 'picked_up' && (
                          <>
                            <button 
                              onClick={() => handleAction('deliver', s.id)}
                              className="tracking-btn"
                            >
                              ✓ Mark Delivered
                            </button>
                            <button className="tracking-btn">📸 Upload Proof</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-card">
              <p className="dashboard-card-help">Your past collections and impact</p>
              {loading ? (
                <p className="dashboard-empty-text">Loading history...</p>
              ) : history.length === 0 ? (
                <p className="dashboard-empty-text">No delivery history yet. Start by accepting pickups!</p>
              ) : (
                <div className="table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Food Item</th>
                        <th>Qty</th>
                        <th>Donor</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((d) => (
                        <tr key={d.id}>
                          <td>{new Date(d.pickupTime || d.createdAt).toLocaleDateString()}</td>
                          <td className="table-cell-main">{d.foodItem || 'Food Item'}</td>
                          <td>{d.quantity} kg</td>
                          <td>Restaurant #{d.restaurantId}</td>
                          <td><StatusBadge status={d.status || 'delivered'} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-card">
              <div className="profile-header">
                <button onClick={() => setEditingProfile(!editingProfile)} className="edit-profile-btn">
                  {editingProfile ? '✕ Cancel' : '✎ Edit'}
                </button>
              </div>

              {editingProfile ? (
                <form className="dashboard-form-large">
                  <div className="form-section">
                    <h4 className="form-section-title">Basic Information</h4>
                    <div className="dashboard-grid-two">
                      <div>
                        <label className="dashboard-label">Full Name</label>
                        <input type="text" placeholder={user?.name || 'Your name'} className="dashboard-input" />
                      </div>
                      <div>
                        <label className="dashboard-label">Phone</label>
                        <input type="tel" placeholder="Your phone number" className="dashboard-input" />
                      </div>
                    </div>
                  </div>
                  <div className="form-section">
                    <h4 className="form-section-title">Vehicle & Preferences</h4>
                    <div>
                      <label className="dashboard-label">Vehicle Type</label>
                      <select className="dashboard-input">
                        <option>Motorcycle</option>
                        <option>Car</option>
                        <option>Van</option>
                        <option>Truck</option>
                        <option>On Foot</option>
                      </select>
                    </div>
                    <div className="dashboard-grid-two">
                      <div>
                        <label className="dashboard-label">Preferred Food Types</label>
                        <input type="text" placeholder="e.g., Cooked Meals, Produce" className="dashboard-input" />
                      </div>
                      <div>
                        <label className="dashboard-label">Operating Area</label>
                        <input type="text" placeholder="Your service area" className="dashboard-input" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="dashboard-primary-button">Save Changes</button>
                </form>
              ) : (
                <div className="profile-view">
                  <div className="profile-section">
                    <h4>Personal Information</h4>
                    <p><strong>Name:</strong> {user?.name || 'Not set'}</p>
                    <p><strong>Email:</strong> {user?.email || 'Not set'}</p>
                    <p><strong>Phone:</strong> {profile?.phone || 'Not set'}</p>
                    <p><strong>Verification:</strong> {user?.verified ? '✓ Verified' : '⏳ Pending verification'}</p>
                  </div>
                  <div className="profile-section">
                    <h4>Collections Overview</h4>
                    <p><strong>Total Collected:</strong> {impact?.totalQuantity?.toFixed(1) || 0} kg</p>
                    <p><strong>Total Deliveries:</strong> {history?.length || 0}</p>
                    <p><strong>Member Since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="profile-section">
                    <h4>Preferences</h4>
                    <p><strong>Notifications:</strong> {profile?.notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
                    <p><strong>Preferred Food Types:</strong> {profile?.preferredCategories || 'All types'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CollectorDashboard;


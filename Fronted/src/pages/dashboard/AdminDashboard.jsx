import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import Footer from '../../components/Footer.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/axios.js';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [users, setUsers] = useState([]);
  const [surpluses, setSurpluses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uRes, sRes, aRes] = await Promise.all([
        api.get('/admin/users').catch(() => ({ data: [] })),
        api.get('/admin/surplus').catch(() => ({ data: [] })),
        api.get('/admin/analytics').catch(() => ({ data: null })),
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
      showToast('✓ Collector verified successfully.');
      await fetchData();
    } catch (err) {
      console.error(err);
      showToast('✗ Failed to verify user.');
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

  // Filtered data
  const filteredUsers = useMemo(() => {
    let result = users;
    if (filterRole !== 'all') {
      result = result.filter(u => u.role === filterRole);
    }
    if (searchTerm) {
      result = result.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [users, filterRole, searchTerm]);

  const donors = useMemo(() => filteredUsers.filter(u => u.role === 'restaurant'), [filteredUsers]);
  const collectors = useMemo(() => filteredUsers.filter(u => u.role === 'collector'), [filteredUsers]);
  
  const expiredSurpluses = useMemo(() => surpluses.filter(s => s.status === 'expired'), [surpluses]);
  const activeSurpluses = useMemo(() => surpluses.filter(s => s.status !== 'expired' && s.status !== 'collected'), [surpluses]);

  return (
    <div className="page-dashboard">
      <Sidebar />
      <main className="dashboard-main">
        {toast && <div className="dashboard-toast">{toast}</div>}

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Monitor platform activity, verify users, and manage food rescue operations</p>
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
            className={`dashboard-tab ${activeTab === 'donors' ? 'active' : ''}`}
            onClick={() => setActiveTab('donors')}
          >
            Donors
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'collectors' ? 'active' : ''}`}
            onClick={() => setActiveTab('collectors')}
          >
            Collectors
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            Listings
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="dashboard-tab-content">
            {/* Key Metrics */}
            <div className="admin-metrics-grid">
              <div className="dashboard-metric-card-large">
                <div className="metric-icon">🌍</div>
                <p className="dashboard-metric-label">Total Food Donated</p>
                <p className="dashboard-metric-value">{analytics?.totalQuantity?.toFixed(1) || '0'} kg</p>
              </div>
              <div className="dashboard-metric-card-large">
                <div className="metric-icon">🍽️</div>
                <p className="dashboard-metric-label">Meals Saved</p>
                <p className="dashboard-metric-value">{analytics?.meals?.toFixed(0) || '0'}</p>
              </div>
              <div className="dashboard-metric-card-large">
                <div className="metric-icon">👥</div>
                <p className="dashboard-metric-label">Active Users</p>
                <p className="dashboard-metric-value">{analytics?.activeUsers || '0'}</p>
              </div>
              <div className="dashboard-metric-card-large">
                <div className="metric-icon">♻️</div>
                <p className="dashboard-metric-label">CO₂ Reduced</p>
                <p className="dashboard-metric-value">{analytics?.co2Saved?.toFixed(1) || '0'} kg</p>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="dashboard-grid-two">
              <div className="dashboard-card">
                <h3 className="dashboard-card-title">Platform Statistics</h3>
                <p className="dashboard-card-help">Current platform status</p>
                <div className="simple-stats">
                  <div className="stat-row">
                    <span>Total Donors</span>
                    <span className="stat-value">{donors.length}</span>
                  </div>
                  <div className="stat-row">
                    <span>Total Collectors</span>
                    <span className="stat-value">{collectors.length}</span>
                  </div>
                  <div className="stat-row">
                    <span>Active Listings</span>
                    <span className="stat-value">{activeSurpluses.length}</span>
                  </div>
                  <div className="stat-row">
                    <span>Expired Items</span>
                    <span className="stat-value" style={{ color: '#dc2626' }}>{expiredSurpluses.length}</span>
                  </div>
                  <div className="stat-row">
                    <span>Pickups This Month</span>
                    <span className="stat-value">{analytics?.totalDeliveries || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span>Unverified Collectors</span>
                    <span className="stat-value">{collectors.filter(c => !c.verified).length}</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3 className="dashboard-card-title">Impact Overview</h3>
                <p className="dashboard-card-help">Platform contribution to environment & community</p>
                {analytics && chartData ? (
                  <div className="admin-chart">
                    <div>
                      <div className="admin-chart-row">
                        <span>Meals Served</span>
                        <span>{analytics.meals?.toFixed(0) || 0}</span>
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
                        <span>{analytics.co2Saved?.toFixed(1) || 0}</span>
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
                        <span>{analytics.totalDeliveries || 0}</span>
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
                  <p className="dashboard-empty-text">Waiting for data...</p>
                )}
              </div>
            </div>

            {/* Alerts */}
            <div className="dashboard-card">
              <h3 className="dashboard-card-title">⚠️ Critical Alerts</h3>
              <p className="dashboard-card-help">Items requiring immediate attention</p>
              {expiredSurpluses.length === 0 ? (
                <p className="dashboard-empty-text">No critical alerts at this time.</p>
              ) : (
                <div className="alerts-list">
                  {expiredSurpluses.slice(0, 5).map((s) => (
                    <div key={s.id} className="alert-item alert-item-critical">
                      <span className="alert-icon">🚨</span>
                      <span className="alert-message"><strong>Expired:</strong> {s.title} from Restaurant #{s.restaurantId} ({s.quantity} kg)</span>
                      <button className="alert-action-btn">Mark</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DONORS TAB */}
        {activeTab === 'donors' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Donor Management</h2>
              <p className="dashboard-card-help">Monitor and manage restaurant donors</p>
              
              <div className="filter-bar">
                <input
                  type="text"
                  placeholder="Search donors by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </div>

              {loading ? (
                <p className="dashboard-empty-text">Loading donors...</p>
              ) : donors.length === 0 ? (
                <p className="dashboard-empty-text">No donors registered yet.</p>
              ) : (
                <div className="table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Food Donated</th>
                        <th>Listings</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donors.map((d) => (
                        <tr key={d.id}>
                          <td className="table-cell-main">{d.name}</td>
                          <td>{d.email}</td>
                          <td>{d.location || 'N/A'}</td>
                          <td>
                            {surpluses.filter(s => s.restaurantId === d.id).reduce((sum, s) => sum + (s.quantity || 0), 0).toFixed(1)} kg
                          </td>
                          <td>{surpluses.filter(s => s.restaurantId === d.id).length}</td>
                          <td className="table-actions">
                            <button className="table-action-btn">View</button>
                            <button className="table-action-btn">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COLLECTORS TAB */}
        {activeTab === 'collectors' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Collector Management</h2>
              <p className="dashboard-card-help">Verify and monitor collectors</p>
              
              <div className="filter-bar">
                <input
                  type="text"
                  placeholder="Search collectors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
                <select 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {loading ? (
                <p className="dashboard-empty-text">Loading collectors...</p>
              ) : collectors.length === 0 ? (
                <p className="dashboard-empty-text">No collectors registered yet.</p>
              ) : (
                <div className="table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Collections</th>
                        <th>Food Rescued</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectors.map((c) => (
                        <tr key={c.id}>
                          <td className="table-cell-main">{c.name}</td>
                          <td>{c.email}</td>
                          <td>{c.completedPickups || 0}</td>
                          <td>{c.totalQuantity?.toFixed(1) || '0'} kg</td>
                          <td>
                            <span className={`admin-verify-pill ${c.verified ? 'admin-verify-pill--ok' : 'admin-verify-pill--pending'}`}>
                              {c.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="table-actions">
                            {!c.verified && (
                              <button 
                                onClick={() => handleVerify(c.id)}
                                className="table-action-btn"
                              >
                                Verify
                              </button>
                            )}
                            <button className="table-action-btn">Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LISTINGS TAB */}
        {activeTab === 'listings' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Active Listings</h2>
              <p className="dashboard-card-help">Monitor all food surplus listings in real-time</p>
              
              {loading ? (
                <p className="dashboard-empty-text">Loading listings...</p>
              ) : activeSurpluses.length === 0 ? (
                <p className="dashboard-empty-text">No active listings at this time.</p>
              ) : (
                <div className="table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Food Item</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Donor</th>
                        <th>Collector</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSurpluses.map((s) => (
                        <tr key={s.id}>
                          <td className="table-cell-main">{s.title}</td>
                          <td>{s.quantity} {s.quantityUnit || 'kg'}</td>
                          <td>{s.foodCategory || '-'}</td>
                          <td>Restaurant #{s.restaurantId}</td>
                          <td>{s.assignedCollectorId ? `Collector #${s.assignedCollectorId}` : 'Unassigned'}</td>
                          <td><StatusBadge status={s.status} /></td>
                          <td className="table-actions">
                            <button className="table-action-btn">Override</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-grid-two">
              <div className="dashboard-card">
                <h3 className="dashboard-card-title">📊 Waste Reduction Trends</h3>
                <p className="dashboard-card-help">Monthly food diversion metrics</p>
                <div className="admin-chart">
                  <div>
                    <div className="admin-chart-row">
                      <span>This Month</span>
                      <span>{analytics?.totalQuantity?.toFixed(1) || 0} kg</span>
                    </div>
                    <div className="admin-chart-bar-bg">
                      <div
                        className="admin-chart-bar admin-chart-bar-meals"
                        style={{ width: '70%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="admin-chart-row">
                      <span>This Quarter</span>
                      <span>{(analytics?.totalQuantity * 3)?.toFixed(1) || 0} kg</span>
                    </div>
                    <div className="admin-chart-bar-bg">
                      <div
                        className="admin-chart-bar admin-chart-bar-co2"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3 className="dashboard-card-title">👥 Collector Performance</h3>
                <p className="dashboard-card-help">Top collectors this month</p>
                <div className="simple-stats">
                  <div className="stat-row">
                    <span>Most Active Collector</span>
                    <span className="stat-value">15 pickups</span>
                  </div>
                  <div className="stat-row">
                    <span>Avg. Collection Time</span>
                    <span className="stat-value">45 mins</span>
                  </div>
                  <div className="stat-row">
                    <span>Success Rate</span>
                    <span className="stat-value">98%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <h3 className="dashboard-card-title">📥 Export Reports</h3>
              <p className="dashboard-card-help">Download platform analytics and reports</p>
              <div className="export-buttons">
                <button className="export-btn">📊 Export Monthly Report (PDF)</button>
                <button className="export-btn">📈 Export Analytics (CSV)</button>
                <button className="export-btn">🎖️ Export Collector Performance</button>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Platform Settings</h2>
              <p className="dashboard-card-help">Configure platform behavior and rules</p>
              
              <div className="settings-section">
                <h4 className="settings-title">Food Categories</h4>
                <div className="settings-list">
                  <div className="settings-item">
                    <span>Cooked Meals</span>
                    <button className="settings-btn">Edit</button>
                  </div>
                  <div className="settings-item">
                    <span>Bakery Products</span>
                    <button className="settings-btn">Edit</button>
                  </div>
                  <div className="settings-item">
                    <span>Fresh Produce</span>
                    <button className="settings-btn">Edit</button>
                  </div>
                  <div className="settings-item">
                    <span>Packaged Foods</span>
                    <button className="settings-btn">Edit</button>
                  </div>
                </div>
                <button className="settings-add-btn">+ Add Category</button>
              </div>

              <div className="settings-section">
                <h4 className="settings-title">Safety Windows & Rules</h4>
                <div className="settings-form">
                  <div className="settings-field">
                    <label>Min. Expiry Window (hours)</label>
                    <input type="number" defaultValue="2" className="settings-input" />
                  </div>
                  <div className="settings-field">
                    <label>Max. Pickup Window (hours)</label>
                    <input type="number" defaultValue="6" className="settings-input" />
                  </div>
                  <div className="settings-field">
                    <label>Enable Recurring Surplus</label>
                    <input type="checkbox" defaultChecked className="settings-checkbox" />
                  </div>
                  <button className="dashboard-primary-button">Save Settings</button>
                </div>
              </div>

              <div className="settings-section">
                <h4 className="settings-title">Badge Gamification</h4>
                <div className="settings-list">
                  <div className="settings-item">
                    <span>🥉 Bronze: 50+ kg collected</span>
                    <button className="settings-btn">Edit</button>
                  </div>
                  <div className="settings-item">
                    <span>🥈 Silver: 500+ kg collected</span>
                    <button className="settings-btn">Edit</button>
                  </div>
                  <div className="settings-item">
                    <span>🥇 Gold: 2000+ kg collected</span>
                    <button className="settings-btn">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;


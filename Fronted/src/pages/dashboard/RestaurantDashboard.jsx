import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faUtensils, faWind, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/Sidebar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/axios.js';

const RestaurantDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const changeTab = (tab, hash) => {
    setActiveTab(tab);
    navigate(`${location.pathname}#${hash}`, { replace: true });
  };

  useEffect(() => {
    const hash = location.hash || '#overview';
    const map = {
      '#overview': 'overview',
      '#add-surplus': 'add-surplus',
      '#listings': 'listings',
      '#tracking': 'tracking',
      '#history': 'history',
      '#profile': 'profile',
    };
    const tab = map[hash] || 'overview';
    if (tab !== activeTab) setActiveTab(tab);
  }, [location.hash]);
  
  const [impact, setImpact] = useState(null);
  const [form, setForm] = useState({
    foodName: '',
    category: 'Cooked Meals',
    quantity: '',
    quantityUnit: 'kg',
    expiryDateTime: '',
    pickupWindowStart: '',
    pickupWindowEnd: '',
    storageType: 'Room Temp',
    specialInstructions: '',
    photoUrl: '',
  });
  
  const [surpluses, setSurpluses] = useState([]);
  const [pickupHistory, setPickupHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, iRes, hRes, nRes, pRes] = await Promise.all([
        api.get('/restaurant/surplus').catch(() => ({ data: [] })),
        api.get('/restaurant/impact').catch(() => ({ data: null })),
        api.get('/restaurant/pickup-history').catch(() => ({ data: [] })),
        api.get('/restaurant/notifications').catch(() => ({ data: [] })),
        api.get('/restaurant/profile').catch(() => ({ data: null })),
      ]);
      setSurpluses(sRes.data || []);
      setImpact(iRes.data || null);
      setPickupHistory(hRes.data || []);
      setNotifications(nRes.data || []);
      setProfile(pRes.data || null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
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
        title: form.foodName,
        foodCategory: form.category,
        quantity: parseFloat(form.quantity || '0'),
        quantityUnit: form.quantityUnit,
        expiryTime: form.expiryDateTime,
        pickupDeadline: form.pickupWindowEnd,
        storageType: form.storageType,
        specialInstructions: form.specialInstructions,
        photoUrl: form.photoUrl,
      };
      await api.post('/restaurant/surplus', payload);
      setForm({
        foodName: '',
        category: 'Cooked Meals',
        quantity: '',
        quantityUnit: 'kg',
        expiryDateTime: '',
        pickupWindowStart: '',
        pickupWindowEnd: '',
        storageType: 'Room Temp',
        specialInstructions: '',
        photoUrl: '',
      });
      showToast('✓ Surplus food listed successfully!');
      await fetchData();
    } catch (err) {
      console.error(err);
      showToast('✗ Failed to report surplus. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

  const activeSurpluses = surpluses.filter(s => s.status !== 'expired' && s.status !== 'collected');
  const pendingPickups = surpluses.filter(s => s.status === 'assigned' || s.status === 'pending');

  const filteredActiveSurpluses = useMemo(() => {
    if (!searchTerm) return activeSurpluses;
    return activeSurpluses.filter((s) =>
      s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.foodCategory?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeSurpluses, searchTerm]);

  return (
    <div className="page-dashboard">
      <Sidebar />
      <main className="dashboard-main">
        {toast && <div className="dashboard-toast">{toast}</div>}

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">Manage food surplus, track impact, and connect with collectors</p>
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


        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-metrics-grid-4">
              <div className="dashboard-metric-card-large">
                <div className="metric-icon metric-icon-orange">
                <FontAwesomeIcon icon={faLeaf} />
              </div>
                <p className="dashboard-metric-label">Total Food Donated</p>
                <p className="dashboard-metric-value">{impact?.totalQuantity?.toFixed(1) || '0'} kg</p>
                <p className="metric-trend">+12% from last month</p>
              </div>
              <div className="dashboard-metric-card-large">
                <div className="metric-icon metric-icon-green">🍽️</div>
                <p className="dashboard-metric-label">Meals Saved</p>
                <p className="dashboard-metric-value">{impact?.meals?.toFixed(0) || '0'}</p>
                <p className="metric-trend">Estimated servings</p>
              </div>
              <div className="dashboard-metric-card-large">
                <div className="metric-icon metric-icon-blue">♻️</div>
                <p className="dashboard-metric-label">CO₂ Reduced</p>
                <p className="dashboard-metric-value">{impact?.co2Saved?.toFixed(1) || '0'} kg</p>
                <p className="metric-trend">Environmental impact</p>
              </div>
              <div className="dashboard-metric-card-large">
                <div className="metric-icon metric-icon-purple">📈</div>
                <p className="dashboard-metric-label">Active Listings</p>
                <p className="dashboard-metric-value">{filteredActiveSurpluses?.length || '0'}</p>
                <p className="metric-trend">Available now</p>
              </div>
            </div>

            <div className="dashboard-charts-grid" style={{ marginTop: '1.5rem' }}>
              <div className="dashboard-chart-card">
                <h3 className="dashboard-card-title">Food Trends (Last 7 Days)</h3>
                <div className="chart-placeholder">Chart placeholder</div>
              </div>
              <div className="dashboard-chart-card">
                <h3 className="dashboard-card-title">Top Contributors</h3>
                <div className="chart-placeholder">Chart placeholder</div>
              </div>
            </div>

            <div className="dashboard-grid-two">
              <div className="dashboard-card">
                <h3 className="dashboard-card-title">Monthly Activity</h3>
                <p className="dashboard-card-help">Your contribution to food rescue</p>
                <div className="simple-stats">
                  <div className="stat-row">
                    <span>Total Pickups</span>
                    <span className="stat-value">{surpluses?.length || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span>Pending Pickups</span>
                    <span className="stat-value">{pendingPickups?.length || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span>Completed</span>
                    <span className="stat-value">{surpluses?.filter(s => s.status === 'collected')?.length || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span>Total Diverted</span>
                    <span className="stat-value">{surpluses?.reduce((sum, s) => sum + (s.quantity || 0), 0)?.toFixed(1) || 0} kg</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3 className="dashboard-card-title">Recent Notifications</h3>
                <p className="dashboard-card-help">Latest updates from the platform</p>
                {notifications.length === 0 ? (
                  <p className="dashboard-empty-text">No new notifications</p>
                ) : (
                  <div className="notification-list">
                    {notifications.slice(0, 5).map((n) => (
                      <div key={n.id} className="notification-item">
                        <span className="notification-type">{n.type}</span>
                        <span className="notification-message">{n.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ADD SURPLUS TAB */}
        {activeTab === 'add-surplus' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Add Surplus Food</h2>
              <p className="dashboard-card-help">
                Provide details about your surplus. Verified collectors will be matched automatically.
              </p>
              <form onSubmit={handleSubmit} className="dashboard-form-large">
                <div className="form-section">
                  <h4 className="form-section-title">Food Details</h4>
                  <div className="dashboard-grid-two">
                    <div>
                      <label className="dashboard-label">Food Name *</label>
                      <input
                        name="foodName"
                        value={form.foodName}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Mixed Vegetables, Cooked Chicken"
                        className="dashboard-input"
                      />
                    </div>
                    <div>
                      <label className="dashboard-label">Category *</label>
                      <select name="category" value={form.category} onChange={handleChange} className="dashboard-input">
                        <option>Cooked Meals</option>
                        <option>Bakery</option>
                        <option>Produce</option>
                        <option>Packaged</option>
                        <option>Dairy</option>
                        <option>Beverages</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="dashboard-label">Description</label>
                    <textarea
                      name="specialInstructions"
                      value={form.specialInstructions}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any special instructions or ingredients info..."
                      className="dashboard-input dashboard-textarea"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h4 className="form-section-title">Quantity & Storage</h4>
                  <div className="dashboard-grid-two">
                    <div>
                      <label className="dashboard-label">Quantity *</label>
                      <div className="input-with-unit">
                        <input
                          name="quantity"
                          type="number"
                          step="0.1"
                          value={form.quantity}
                          onChange={handleChange}
                          required
                          placeholder="0"
                          className="dashboard-input"
                        />
                        <select name="quantityUnit" value={form.quantityUnit} onChange={handleChange} className="dashboard-select-unit">
                          <option>kg</option>
                          <option>liters</option>
                          <option>portions</option>
                          <option>units</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="dashboard-label">Storage Type *</label>
                      <select name="storageType" value={form.storageType} onChange={handleChange} className="dashboard-input">
                        <option>Room Temp</option>
                        <option>Cold (2-8°C)</option>
                        <option>Frozen (-18°C)</option>
                        <option>Hot (60°C+)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4 className="form-section-title">Availability Schedule</h4>
                  <div className="dashboard-grid-two">
                    <div>
                      <label className="dashboard-label">Expiry Date & Time *</label>
                      <input
                        name="expiryDateTime"
                        type="datetime-local"
                        value={form.expiryDateTime}
                        onChange={handleChange}
                        required
                        className="dashboard-input"
                      />
                    </div>
                    <div>
                      <label className="dashboard-label">Pickup Window *</label>
                      <div className="time-window">
                        <input
                          name="pickupWindowStart"
                          type="time"
                          value={form.pickupWindowStart}
                          onChange={handleChange}
                          className="dashboard-input"
                        />
                        <span className="time-separator">to</span>
                        <input
                          name="pickupWindowEnd"
                          type="time"
                          value={form.pickupWindowEnd}
                          onChange={handleChange}
                          required
                          className="dashboard-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4 className="form-section-title">Photo (Optional)</h4>
                  <input
                    name="photoUrl"
                    type="url"
                    value={form.photoUrl}
                    onChange={handleChange}
                    placeholder="Image URL (future: file upload)"
                    className="dashboard-input"
                  />
                  <p className="dashboard-card-help">Upload a photo of the food for verification</p>
                </div>

                <button type="submit" disabled={submitting} className="dashboard-primary-button-large">
                  {submitting ? 'Listing Food...' : '📦 List Food for Pickup'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ACTIVE LISTINGS TAB */}
        {activeTab === 'listings' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Active Food Listings</h2>
              <p className="dashboard-card-help">Track all your active surplus listings</p>
              {loading ? (
                <p className="dashboard-empty-text">Loading listings...</p>
              ) : filteredActiveSurpluses.length === 0 ? (
                <p className="dashboard-empty-text">No active listings. Start by adding surplus food.</p>
              ) : (
                <div className="table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Food Item</th>
                        <th>Quantity</th>
                        <th>Expiry</th>
                        <th>Storage</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredActiveSurpluses.map((s) => (
                        <tr key={s.id}>
                          <td className="table-cell-main">{s.title}</td>
                          <td>{s.quantity} {s.quantityUnit || 'kg'}</td>
                          <td>
                            <span className={`countdown-badge countdown-badge-${calculateExpiryCountdown(s.expiryTime) === 'Expired' ? 'red' : 'yellow'}`}>
                              {calculateExpiryCountdown(s.expiryTime)}
                            </span>
                          </td>
                          <td>{s.storageType || 'Room Temp'}</td>
                          <td><StatusBadge status={s.status} /></td>
                          <td className="table-actions">
                            <button className="table-action-btn">Edit</button>
                            <button className="table-action-btn table-action-btn-danger">Cancel</button>
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

        {/* PICKUP TRACKING TAB */}
        {activeTab === 'tracking' && (
          <div className="dashboard-tab-content">
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Pickup Tracking</h2>
              <p className="dashboard-card-help">Real-time tracking of assigned pickups</p>
              {loading ? (
                <p className="dashboard-empty-text">Loading pickups...</p>
              ) : pendingPickups.length === 0 ? (
                <p className="dashboard-empty-text">No active pickups being tracked.</p>
              ) : (
                <div className="tracking-list">
                  {pendingPickups.map((pickup) => (
                    <div key={pickup.id} className="tracking-card">
                      <div className="tracking-header">
                        <h4>{pickup.title}</h4>
                        <StatusBadge status={pickup.status} />
                      </div>
                      <div className="tracking-details">
                        <div className="tracking-detail-row">
                          <span className="label">Quantity:</span>
                          <span className="value">{pickup.quantity} kg</span>
                        </div>
                        <div className="tracking-detail-row">
                          <span className="label">Collector:</span>
                          <span className="value">Collector #{pickup.assignedCollectorId || 'Not assigned'}</span>
                        </div>
                        <div className="tracking-detail-row">
                          <span className="label">Pickup By:</span>
                          <span className="value">{new Date(pickup.pickupDeadline).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="tracking-actions">
                        <button className="tracking-btn">📍 View Location</button>
                        <button className="tracking-btn">💬 Chat</button>
                        <button className="tracking-btn">✓ Mark Handed Over</button>
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
              <h2 className="dashboard-card-title">Pickup History</h2>
              <p className="dashboard-card-help">Historical record of all pickups</p>
              {loading ? (
                <p className="dashboard-empty-text">Loading history...</p>
              ) : pickupHistory.length === 0 ? (
                <p className="dashboard-empty-text">No pickup history yet.</p>
              ) : (
                <div className="table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Food Item</th>
                        <th>Quantity</th>
                        <th>Collector</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pickupHistory.map((h) => (
                        <tr key={h.id}>
                          <td>{new Date(h.date).toLocaleDateString()}</td>
                          <td className="table-cell-main">{h.foodItem}</td>
                          <td>{h.quantity} kg</td>
                          <td>{h.collector || 'N/A'}</td>
                          <td><StatusBadge status={h.confirmationStatus} /></td>
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
                <h2 className="dashboard-card-title">Business Profile</h2>
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
                        <label className="dashboard-label">Business Name</label>
                        <input type="text" placeholder="Your restaurant name" className="dashboard-input" />
                      </div>
                      <div>
                        <label className="dashboard-label">Business Type</label>
                        <select className="dashboard-input">
                          <option>Restaurant</option>
                          <option>Bakery</option>
                          <option>Hotel</option>
                          <option>Catering</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-section">
                    <h4 className="form-section-title">Contact & Location</h4>
                    <div>
                      <label className="dashboard-label">Address</label>
                      <input type="text" placeholder="Full address" className="dashboard-input" />
                    </div>
                    <div className="dashboard-grid-two">
                      <div>
                        <label className="dashboard-label">Contact Person</label>
                        <input type="text" placeholder="Name" className="dashboard-input" />
                      </div>
                      <div>
                        <label className="dashboard-label">Phone</label>
                        <input type="tel" placeholder="Phone number" className="dashboard-input" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="dashboard-primary-button">Save Changes</button>
                </form>
              ) : (
                <div className="profile-view">
                  <div className="profile-section">
                    <h4>Business Information</h4>
                    <p><strong>Name:</strong> {profile?.businessName || 'Your Restaurant'}</p>
                    <p><strong>Type:</strong> {profile?.businessType || 'Restaurant'}</p>
                    <p><strong>Address:</strong> {profile?.address || 'Not set'}</p>
                    <p><strong>Contact:</strong> {profile?.contactPerson || 'Not set'}</p>
                  </div>
                  <div className="profile-section">
                    <h4>Preferences</h4>
                    <p><strong>Notifications:</strong> {profile?.notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
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

export default RestaurantDashboard;


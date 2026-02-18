import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, CheckCircle, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../services/supabaseClient';
import { formatNumber } from '../../utils/calculations';
import '../donor/DonorPages.css';

const NGODashboard = () => {
  const [availableDonations, setAvailableDonations] = useState([]);
  const [collectedDonations, setCollectedDonations] = useState([]);
  const [stats, setStats] = useState({
    totalFoodCollected: 0,
    co2Reduced: 0,
    methaneReduced: 0
  });

  const menuItems = [
    { path: '/ngo/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/ngo/available', label: 'Available Donations', icon: <Package size={20} /> },
    { path: '/ngo/collected', label: 'Collected Donations', icon: <CheckCircle size={20} /> },
    { path: '/ngo/impact', label: 'Impact Report', icon: <TrendingUp size={20} /> }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*');

    if (!error && data) {
      const available = data.filter(d => d.status === 'available');
      const collected = data.filter(d => d.status === 'collected');

      setAvailableDonations(available);
      setCollectedDonations(collected);

      const totalFood = collected.reduce(
        (sum, d) => sum + Number(d.quantity || 0),
        0
      );

      setStats({
        totalFoodCollected: totalFood,
        co2Reduced: totalFood * 2.5,
        methaneReduced: totalFood * 0.5
      });
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Monitor food collections and environmental impact</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card fade-in">
          <div className="stat-icon">
            <Package size={32} color="#10b981" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Food Collected</p>
            <h2 className="stat-value">
              {formatNumber(stats.totalFoodCollected)} kg
            </h2>
          </div>
        </div>

        <div className="stat-card fade-in">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <path d="M3 12h4l3 9 4-18 3 9h4"></path>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">CO2 Reduced</p>
            <h2 className="stat-value">
              {formatNumber(stats.co2Reduced)} kg
            </h2>
          </div>
        </div>

        <div className="stat-card fade-in">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 12h8"></path>
              <path d="M12 8v8"></path>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Methane Prevented</p>
            <h2 className="stat-value">
              {formatNumber(stats.methaneReduced)} kg
            </h2>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h3>Available Donations ({availableDonations.length})</h3>
          <div className="recent-donations">
            {availableDonations.length === 0 ? (
              <p>No available donations.</p>
            ) : (
              availableDonations.slice(0, 3).map((donation) => (
                <div key={donation.id} className="donation-item">
                  <div className="donation-info">
                    <strong>{donation.food_type}</strong>
                    <span className="donation-meta">
                      {donation.quantity} kg
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3>Collection Activity</h3>
          <div className="impact-chart">
            <div className="impact-item">
              <div className="impact-bar-container">
                <div className="impact-label">
                  <span>Total Collected</span>
                  <strong>{collectedDonations.length}</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '70%', background: '#10b981' }}></div>
                </div>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-bar-container">
                <div className="impact-label">
                  <span>Available Now</span>
                  <strong>{availableDonations.length}</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '40%', background: '#3b82f6' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NGODashboard;

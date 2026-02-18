import { LayoutDashboard, Plus, Package, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { formatNumber } from '../../utils/calculations';
import './DonorPages.css';

const DonorDashboard = () => {
  const { user } = useAuth();

  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalFoodDonated: 0,
    co2Reduced: 0,
    methaneReduced: 0
  });

  const menuItems = [
    { path: '/donor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/donor/add-donation', label: 'Add Donation', icon: <Plus size={20} /> },
    { path: '/donor/my-donations', label: 'My Donations', icon: <Package size={20} /> },
    { path: '/donor/impact', label: 'Impact Report', icon: <TrendingUp size={20} /> }
  ];

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', user.id);

      if (!error && data) {
        setDonations(data);

        const totalFood = data.reduce(
          (sum, d) => sum + Number(d.quantity || 0),
          0
        );

        setStats({
          totalDonations: data.length,
          totalFoodDonated: totalFood,
          co2Reduced: totalFood * 2.5,
          methaneReduced: totalFood * 0.5
        });
      }
    };

    fetchDonations();
  }, [user]);

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Track your donation impact and contributions</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card fade-in">
          <div className="stat-icon">
            <Package size={32} color="#10b981" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Donations Made</p>
            <h2 className="stat-value">{stats.totalDonations}</h2>
          </div>
        </div>

        <div className="stat-card fade-in">
          <div className="stat-icon">
            <TrendingUp size={32} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Food Donated</p>
            <h2 className="stat-value">{formatNumber(stats.totalFoodDonated)} kg</h2>
          </div>
        </div>

        <div className="stat-card fade-in">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <path d="M3 12h4l3 9 4-18 3 9h4"></path>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">CO2 Emissions Reduced</p>
            <h2 className="stat-value">{formatNumber(stats.co2Reduced)} kg</h2>
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
            <h2 className="stat-value">{formatNumber(stats.methaneReduced)} kg</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h3>Recent Donations</h3>
          <div className="recent-donations">
            {donations.length === 0 ? (
              <p>No donations yet.</p>
            ) : (
              donations.slice(0, 3).map((donation) => (
                <div key={donation.id} className="donation-item">
                  <div className="donation-info">
                    <strong>{donation.food_type}</strong>
                    <span className="donation-meta">
                      {donation.quantity} kg • {donation.pickup_time}
                    </span>
                  </div>
                  <span className={`status-badge status-${donation.status?.toLowerCase()}`}>
                    {donation.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DonorDashboard;

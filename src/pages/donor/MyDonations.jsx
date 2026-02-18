import { useEffect, useState } from 'react';
import { LayoutDashboard, Plus, Package, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import './DonorPages.css';

const MyDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

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
        .eq('donor_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDonations(data);
      }

      setLoading(false);
    };

    fetchDonations();
  }, [user]);

  const availableCount = donations.filter(d => d.status === 'available').length;
  const collectedCount = donations.filter(d => d.status === 'collected').length;

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="dashboard-header">
        <div>
          <h1>My Donations</h1>
          <p>View and track all your food donations</p>
        </div>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          {loading ? (
            <p>Loading...</p>
          ) : donations.length === 0 ? (
            <p>No donations added yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Food Type</th>
                  <th>Quantity</th>
                  <th>Pickup Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="fade-in">
                    <td>
                      <div className="table-cell-content">
                        <Package size={18} color="#10b981" />
                        <strong>{donation.food_type}</strong>
                      </div>
                    </td>
                    <td>{donation.quantity} kg</td>
                    <td>{new Date(donation.pickup_time).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${donation.status}`}>
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-card">
          <h3>Total Donations</h3>
          <p className="summary-value">{donations.length}</p>
        </div>
        <div className="summary-card">
          <h3>Available</h3>
          <p className="summary-value">{availableCount}</p>
        </div>
        <div className="summary-card">
          <h3>Collected</h3>
          <p className="summary-value">{collectedCount}</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyDonations;

import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Package, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../services/supabaseClient';
import '../donor/DonorPages.css';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
   
    { path: '/admin/donations', label: 'Donations', icon: <Package size={20} /> },
    { path: '/admin/impact', label: 'Environmental Impact', icon: <TrendingUp size={20} /> }
  ];

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDonations(data);
    }

    setLoading(false);
  };

  const totalDonations = donations.length;
  const availableCount = donations.filter(d => d.status === 'available').length;
  const collectedCount = donations.filter(d => d.status === 'collected').length;

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="dashboard-header">
        <div>
          <h1>Donation Management</h1>
          <p>Monitor all donations across the platform</p>
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-card">
          <h3>Total Donations</h3>
          <p className="summary-value">{totalDonations}</p>
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

      <div className="card table-card">
        <div className="table-responsive">
          {loading ? (
            <p>Loading...</p>
          ) : donations.length === 0 ? (
            <p>No donations found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Donor ID</th>
                  <th>Food Type</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Pickup Time</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="fade-in">
                    <td>
                      <div className="table-cell-content">
                        <Package size={18} color="#10b981" />
                        <strong>{donation.donor_id}</strong>
                      </div>
                    </td>
                    <td>{donation.food_type}</td>
                    <td>{donation.quantity} kg</td>
                    <td>
                      <span className={`status-badge status-${donation.status}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td>{new Date(donation.pickup_time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDonations;

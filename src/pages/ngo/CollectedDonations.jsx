import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../services/supabaseClient';
import '../donor/DonorPages.css';

const CollectedDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    {
      path: '/ngo/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: '/ngo/available',
      label: 'Available Donations',
      icon: <Package size={20} />,
    },
    {
      path: '/ngo/collected',
      label: 'Collected Donations',
      icon: <CheckCircle size={20} />,
    },
    {
      path: '/ngo/impact',
      label: 'Impact Report',
      icon: <TrendingUp size={20} />,
    },
  ];

  useEffect(() => {
    fetchCollectedDonations();
  }, []);

  const fetchCollectedDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'collected')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDonations(data);
    }

    setLoading(false);
  };

  const totalFood = donations.reduce(
    (sum, d) => sum + Number(d.quantity || 0),
    0
  );

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="dashboard-header">
        <div>
          <h1>Collected Donations</h1>
          <p>View your collection history and track food redistributed</p>
        </div>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          {loading ? (
            <p>Loading...</p>
          ) : donations.length === 0 ? (
            <p>No collected donations yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Donor ID</th>
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
                        <CheckCircle size={18} color="#10b981" />
                        <strong>{donation.donor_id}</strong>
                      </div>
                    </td>
                    <td>{donation.food_type}</td>
                    <td>{donation.quantity} kg</td>
                    <td>{new Date(donation.pickup_time).toLocaleString()}</td>
                    <td>
                      <span className="status-badge status-collected">
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
          <h3>Total Collections</h3>
          <p className="summary-value">{donations.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Food (kg)</h3>
          <p className="summary-value">{totalFood}</p>
        </div>
        <div className="summary-card">
          <h3>This Month</h3>
          <p className="summary-value">{donations.length}</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CollectedDonations;

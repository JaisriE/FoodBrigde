import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, CheckCircle, TrendingUp, MapPin, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import Notification from '../../components/Notification';
import { supabase } from '../../services/supabaseClient';
import '../donor/DonorPages.css';
import './NGOPages.css';

const AvailableDonations = () => {
  const [donations, setDonations] = useState([]);
  const [notification, setNotification] = useState(null);

  const menuItems = [
    { path: '/ngo/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/ngo/available', label: 'Available Donations', icon: <Package size={20} /> },
    { path: '/ngo/collected', label: 'Collected Donations', icon: <CheckCircle size={20} /> },
    { path: '/ngo/impact', label: 'Impact Report', icon: <TrendingUp size={20} /> }
  ];

  useEffect(() => {
    fetchAvailableDonations();
  }, []);

  const fetchAvailableDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDonations(data);
    }
  };

  const handleAccept = async (id, foodType) => {
    const { error } = await supabase
      .from('donations')
      .update({ status: 'collected' })
      .eq('id', id);

    if (error) {
      setNotification({ type: 'error', message: error.message });
      return;
    }

    setNotification({
      type: 'success',
      message: `Successfully accepted ${foodType} donation!`
    });

    fetchAvailableDonations(); // refresh list
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="dashboard-header">
        <div>
          <h1>Available Donations</h1>
          <p>Browse and accept food donations ready for collection</p>
        </div>
      </div>

      <div className="donations-grid">
        {donations.map((donation) => (
          <div key={donation.id} className="donation-card fade-in">
            <div className="donation-card-header">
              <div className="donation-type-badge">{donation.food_type}</div>
              <div className="donation-quantity">{donation.quantity} kg</div>
            </div>

            <div className="donation-card-body">
              <div className="donation-detail">
                <Package size={18} color="#6b7280" />
                <span>Donor ID: {donation.donor_id}</span>
              </div>
              <div className="donation-detail">
                <MapPin size={18} color="#6b7280" />
                <span>Location not provided</span>
              </div>
              <div className="donation-detail">
                <Clock size={18} color="#6b7280" />
                <span>{new Date(donation.pickup_time).toLocaleString()}</span>
              </div>
            </div>

            <div className="donation-card-footer">
              <button
                className="btn-primary"
                onClick={() => handleAccept(donation.id, donation.food_type)}
              >
                Accept Donation
              </button>
            </div>
          </div>
        ))}

        {donations.length === 0 && (
          <div className="empty-state">
            <Package size={64} color="#d1d5db" />
            <h3>No available donations</h3>
            <p>Check back later for new donation opportunities</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AvailableDonations;

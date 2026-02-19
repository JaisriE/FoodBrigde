import { useState } from 'react';
import { LayoutDashboard, Plus, Package, TrendingUp, MapPin, Phone } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import Notification from '../../components/Notification';
import { calculateEnvironmentalImpact } from '../../utils/calculations';
import { supabase } from '../../services/supabaseClient';
import './DonorPages.css';

const AddDonation = () => {
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [impactPreview, setImpactPreview] = useState(null);

  const menuItems = [
    { path: '/donor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/donor/add-donation', label: 'Add Donation', icon: <Plus size={20} /> },
    { path: '/donor/my-donations', label: 'My Donations', icon: <Package size={20} /> },
    { path: '/donor/impact', label: 'Impact Report', icon: <TrendingUp size={20} /> }
  ];

  const handleQuantityChange = (value) => {
    setQuantity(value);
    if (value > 0) {
      const impact = calculateEnvironmentalImpact(parseFloat(value));
      setImpactPreview(impact);
    } else {
      setImpactPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setNotification({ type: 'error', message: 'User not authenticated.' });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('donations').insert([
      {
        donor_id: user.id,
        donor_name: user.user_metadata?.name || 'Unknown',
        donor_phone: donorPhone,
        food_type: foodType,
        quantity: parseFloat(quantity),
        pickup_time: pickupTime,
        pickup_address: pickupAddress,
        status: 'available'
      }
    ]);

    setLoading(false);

    if (error) {
      setNotification({ type: 'error', message: error.message });
      return;
    }

    setNotification({
      type: 'success',
      message: `Donation of ${quantity}kg ${foodType} added successfully!`
    });

    setFoodType('');
    setQuantity('');
    setPickupTime('');
    setPickupAddress('');
    setDonorPhone('');
    setImpactPreview(null);
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
          <h1>Add Donation</h1>
          <p>Register your food donation for redistribution</p>
        </div>
      </div>

      <div className="form-layout">
        <div className="card form-card">
          <h3>Donation Details</h3>
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Food Type *</label>
              <input
                type="text"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity (kg) *</label>
              <input
                type="number"
                min="1"
                step="0.1"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Pickup Time *</label>
              <input
                type="datetime-local"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <MapPin size={16} style={{ marginRight: '6px' }} />
                Pickup Address *
              </label>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Phone size={16} style={{ marginRight: '6px' }} />
                Contact Phone *
              </label>
              <input
                type="text"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="Enter your contact number"
                required
              />
            </div>

            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Donation'}
            </button>

          </form>
        </div>

        {impactPreview && (
          <div className="card impact-preview fade-in">
            <h3>Environmental Impact Preview</h3>
            <p>Your donation of {quantity}kg will prevent:</p>

            <div className="impact-preview-stats">
              <div className="preview-stat">
                <p>CO2 Reduction</p>
                <p>{impactPreview.co2Reduced} kg</p>
              </div>

              <div className="preview-stat">
                <p>Methane Prevention</p>
                <p>{impactPreview.methaneReduced} kg</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AddDonation;

import { useEffect, useState } from 'react';
import { LayoutDashboard, Plus, Package, TrendingUp, Leaf } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { formatNumber } from '../../utils/calculations';
import './DonorPages.css';

const DonorImpact = () => {
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
    if (!user) return;

    const fetchDonations = async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', user.id);

      if (!error && data) {
        setDonations(data);
      }

      setLoading(false);
    };

    fetchDonations();
  }, [user]);

  // 🔥 Dynamic Calculations
  const totalDonations = donations.length;

  const totalFood = donations.reduce(
    (sum, donation) => sum + Number(donation.quantity),
    0
  );

  const co2Reduced = totalFood * 2.5;
  const methaneReduced = totalFood * 0.5;

  const estimatedMeals = Math.floor(totalFood * 3); // approx 3 meals per kg

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems}>
        <p>Loading impact data...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="dashboard-header">
        <div>
          <h1>Environmental Impact Report</h1>
          <p>See the positive impact of your contributions</p>
        </div>
      </div>

      <div className="impact-hero">
        <div className="impact-hero-card">
          <Leaf size={48} color="#10b981" />
          <h2>Your Impact on the Environment</h2>
          <p>
            Through your {totalDonations} donations totaling {formatNumber(totalFood)} kg of food,
            you've made a meaningful environmental contribution.
          </p>
        </div>
      </div>

      <div className="impact-stats-grid">
        <div className="impact-stat-card">
          <div className="impact-icon green">
            <Leaf size={40} color="white" />
          </div>
          <div>
            <p className="impact-stat-label">CO₂ Emissions Reduced</p>
            <h2 className="impact-stat-value">{formatNumber(co2Reduced)} kg</h2>
          </div>
        </div>

        <div className="impact-stat-card">
          <div className="impact-icon blue">
            <Leaf size={40} color="white" />
          </div>
          <div>
            <p className="impact-stat-label">Methane Prevented</p>
            <h2 className="impact-stat-value">{formatNumber(methaneReduced)} kg</h2>
          </div>
        </div>

        <div className="impact-stat-card">
          <div className="impact-icon purple">
            <Package size={40} color="white" />
          </div>
          <div>
            <p className="impact-stat-label">Food Saved from Landfill</p>
            <h2 className="impact-stat-value">{formatNumber(totalFood)} kg</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Impact Highlights</h3>
        <div className="comparison-grid">
          <div className="comparison-item">
            <div className="comparison-icon">🍽️</div>
            <p>
              Provided approximately <strong>{estimatedMeals} meals</strong> to those in need
            </p>
          </div>
          <div className="comparison-item">
            <div className="comparison-icon">🌳</div>
            <p>
              Equivalent to growing <strong>{Math.floor(co2Reduced / 20)} trees</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="card sdg-alignment">
        <h3>UN Sustainable Development Goals Alignment</h3>
        <div className="sdg-badges">
          <div className="sdg-badge">
            <div className="sdg-badge-number">2</div>
            <div>
              <p className="sdg-badge-title">Zero Hunger</p>
              <p className="sdg-badge-desc">Redistributing food to those in need</p>
            </div>
          </div>
          <div className="sdg-badge">
            <div className="sdg-badge-number">12</div>
            <div>
              <p className="sdg-badge-title">Responsible Consumption</p>
              <p className="sdg-badge-desc">Reducing food waste and promoting sustainability</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DonorImpact;

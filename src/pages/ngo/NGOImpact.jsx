import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, CheckCircle, TrendingUp, Users } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../services/supabaseClient';
import { formatNumber } from '../../utils/calculations';
import '../donor/DonorPages.css';

const NGOImpact = () => {
  const [collectedDonations, setCollectedDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { path: '/ngo/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/ngo/available', label: 'Available Donations', icon: <Package size={20} /> },
    { path: '/ngo/collected', label: 'Collected Donations', icon: <CheckCircle size={20} /> },
    { path: '/ngo/impact', label: 'Impact Report', icon: <TrendingUp size={20} /> }
  ];

  useEffect(() => {
    fetchCollectedDonations();
  }, []);

  const fetchCollectedDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'collected');

    if (!error && data) {
      setCollectedDonations(data);
    }

    setLoading(false);
  };

  // 🔥 Dynamic calculations
  const totalFoodCollected = collectedDonations.reduce(
    (sum, donation) => sum + Number(donation.quantity),
    0
  );

  const co2Reduced = totalFoodCollected * 2.5;
  const methaneReduced = totalFoodCollected * 0.5;
  const estimatedMeals = Math.floor(totalFoodCollected * 3);
  const estimatedPeople = Math.floor(estimatedMeals / 3);

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
          <h1>Impact Report</h1>
          <p>Measure your contribution to food redistribution and sustainability</p>
        </div>
      </div>

      <div className="impact-hero">
        <div className="impact-hero-card">
          <Users size={48} color="white" />
          <h2>Community Impact</h2>
          <p>
            Your organization has collected {formatNumber(totalFoodCollected)} kg of food,
            helping feed families while protecting the environment.
          </p>
        </div>
      </div>

      <div className="impact-stats-grid">
        <div className="impact-stat-card">
          <div className="impact-icon green">
            <Package size={40} color="white" />
          </div>
          <div>
            <p className="impact-stat-label">Total Food Collected</p>
            <h2 className="impact-stat-value">{formatNumber(totalFoodCollected)} kg</h2>
            <p className="impact-stat-desc">Approx {estimatedMeals} meals served</p>
          </div>
        </div>

        <div className="impact-stat-card">
          <div className="impact-icon blue">
            <Package size={40} color="white" />
          </div>
          <div>
            <p className="impact-stat-label">CO₂ Emissions Reduced</p>
            <h2 className="impact-stat-value">{formatNumber(co2Reduced)} kg</h2>
          </div>
        </div>

        <div className="impact-stat-card">
          <div className="impact-icon purple">
            <Package size={40} color="white" />
          </div>
          <div>
            <p className="impact-stat-label">Methane Prevented</p>
            <h2 className="impact-stat-value">{formatNumber(methaneReduced)} kg</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Community Benefits</h3>
        <div className="comparison-grid">
          <div className="comparison-item">
            <div className="comparison-icon">🍽️</div>
            <p>
              Provided approximately <strong>{estimatedMeals} meals</strong>
            </p>
          </div>

          <div className="comparison-item">
            <div className="comparison-icon">👥</div>
            <p>
              Served around <strong>{estimatedPeople} people</strong>
            </p>
          </div>

          <div className="comparison-item">
            <div className="comparison-icon">💚</div>
            <p>
              Prevented <strong>{formatNumber(totalFoodCollected)} kg</strong> from landfill
            </p>
          </div>

          <div className="comparison-item">
            <div className="comparison-icon">🌍</div>
            <p>
              Contributed to sustainability and circular economy
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NGOImpact;

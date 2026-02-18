import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Package, TrendingUp, Leaf } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../services/supabaseClient';
import { formatNumber } from '../../utils/calculations';
import '../donor/DonorPages.css';
import './AdminPages.css';

const AdminImpact = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
    { path: '/admin/donations', label: 'Donations', icon: <Package size={20} /> },
    { path: '/admin/impact', label: 'Environmental Impact', icon: <TrendingUp size={20} /> }
  ];

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*');

    if (!error && data) {
      setDonations(data);
    }

    setLoading(false);
  };

  // 🔥 Dynamic Calculations
  const totalFoodSaved = donations.reduce(
    (sum, donation) => sum + Number(donation.quantity),
    0
  );

  const totalCO2Reduced = totalFoodSaved * 2.5;
  const totalMethaneReduced = totalFoodSaved * 0.5;
  const estimatedMeals = Math.floor(totalFoodSaved * 3);

  // 📈 Monthly CO2 Trend
  const monthlyImpact = Array.from({ length: 12 }, (_, i) => {
    const monthName = new Date(2024, i).toLocaleString('default', { month: 'short' });

    const monthDonations = donations.filter(d => {
      const date = new Date(d.created_at);
      return date.getMonth() === i;
    });

    const monthFood = monthDonations.reduce(
      (sum, d) => sum + Number(d.quantity),
      0
    );

    return {
      month: monthName,
      co2: monthFood * 2.5
    };
  });

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
          <h1>Environmental Impact Dashboard</h1>
          <p>Track the platform's contribution to sustainability goals</p>
        </div>
      </div>

      <div className="impact-hero">
        <div className="impact-hero-card">
          <Leaf size={48} color="white" />
          <h2>Global Environmental Impact</h2>
          <p>
            Together, our community has saved {formatNumber(totalFoodSaved)} kg of food,
            preventing significant greenhouse gas emissions.
          </p>
        </div>
      </div>

      <div className="impact-stats-grid">
        <div className="impact-stat-card">
          <div className="impact-icon green">
            <Package size={40} color="white" />
          </div>
          <div>
            <p className="impact-stat-label">Total Food Saved</p>
            <h2 className="impact-stat-value">{formatNumber(totalFoodSaved)} kg</h2>
            <p className="impact-stat-desc">≈ {estimatedMeals} meals provided</p>
          </div>
        </div>

        <div className="impact-stat-card">
          <div className="impact-icon blue">
            <Leaf size={40} color="white" />
          </div>
          <div>
            <p className="impact-stat-label">Total CO₂ Reduced</p>
            <h2 className="impact-stat-value">{formatNumber(totalCO2Reduced)} kg</h2>
          </div>
        </div>

        <div className="impact-stat-card">
          <div className="impact-icon purple">
            <Leaf size={40} color="white" />
          </div>
          <div>
            <p className="impact-stat-label">Total Methane Prevented</p>
            <h2 className="impact-stat-value">{formatNumber(totalMethaneReduced)} kg</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>CO₂ Reduction Trend</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyImpact}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="co2"
                stroke="#10b981"
                strokeWidth={3}
                name="CO₂ Reduced (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card sdg-alignment">
        <h3>UN Sustainable Development Goals Contribution</h3>
        <div className="sdg-badges">
          <div className="sdg-badge">
            <div className="sdg-badge-number">2</div>
            <div>
              <p className="sdg-badge-title">Zero Hunger</p>
              <p className="sdg-badge-desc">
                {formatNumber(totalFoodSaved)} kg redistributed • ≈ {estimatedMeals} meals
              </p>
            </div>
          </div>

          <div className="sdg-badge">
            <div className="sdg-badge-number">12</div>
            <div>
              <p className="sdg-badge-title">Responsible Consumption</p>
              <p className="sdg-badge-desc">
                {donations.length} waste prevention actions
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminImpact;

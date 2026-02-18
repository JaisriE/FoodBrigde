import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Package, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../services/supabaseClient';
import { formatNumber } from '../../utils/calculations';
import '../donor/DonorPages.css';
import './AdminPages.css';

const AdminDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalNGOs: 0,
    totalDonations: 0,
    totalFoodSaved: 0
  });

  const menuItems = [
    { path: '/admin/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
    { path: '/admin/donations', label: 'Donations', icon: <Package size={20} /> },
    { path: '/admin/impact', label: 'Environmental Impact', icon: <TrendingUp size={20} /> }
  ];

  const COLORS = ['#10b981', '#3b82f6'];

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const { data, error } = await supabase.from('donations').select('*');

    if (!error && data) {
      setDonations(data);

      const totalFood = data.reduce(
        (sum, d) => sum + Number(d.quantity || 0),
        0
      );

      const uniqueDonors = [...new Set(data.map(d => d.donor_id))];

      setStats({
        totalDonors: uniqueDonors.length,
        totalNGOs: 1, // you can later track real NGO accounts
        totalDonations: data.length,
        totalFoodSaved: totalFood
      });
    }
  };

  const donationStatusData = [
    { name: 'Available', value: donations.filter(d => d.status === 'available').length },
    { name: 'Collected', value: donations.filter(d => d.status === 'collected').length }
  ];

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i).toLocaleString('default', { month: 'short' });
    const count = donations.filter(d => {
      const date = new Date(d.created_at);
      return date.getMonth() === i;
    }).length;
    return { month, donations: count };
  });

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="dashboard-header">
        <div>
          <h1>Admin Overview</h1>
          <p>System-wide metrics and performance dashboard</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Users size={32} color="#10b981" />
          <p>Total Donors</p>
          <h2>{formatNumber(stats.totalDonors)}</h2>
        </div>

        <div className="stat-card">
          <Users size={32} color="#3b82f6" />
          <p>Total NGOs</p>
          <h2>{formatNumber(stats.totalNGOs)}</h2>
        </div>

        <div className="stat-card">
          <Package size={32} color="#8b5cf6" />
          <p>Total Donations</p>
          <h2>{formatNumber(stats.totalDonations)}</h2>
        </div>

        <div className="stat-card">
          <TrendingUp size={32} color="#059669" />
          <p>Food Saved</p>
          <h2>{formatNumber(stats.totalFoodSaved)} kg</h2>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <h3>Donation Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={donationStatusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                {donationStatusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Monthly Donation Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="donations" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

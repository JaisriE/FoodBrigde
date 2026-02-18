import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../services/supabaseClient';
import '../donor/DonorPages.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Overview',
      icon: <LayoutDashboard size={20} />,
    },
    { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
    {
      path: '/admin/donations',
      label: 'Donations',
      icon: <Package size={20} />,
    },
    {
      path: '/admin/impact',
      label: 'Environmental Impact',
      icon: <TrendingUp size={20} />,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: usersData } = await supabase.from('users').select('*');

    const { data: donationsData } = await supabase
      .from('donations')
      .select('*');

    if (usersData) setUsers(usersData);
    if (donationsData) setDonations(donationsData);

    setLoading(false);
  };

  const totalUsers = users.length;
  const donorCount = users.filter((u) => u.role === 'donor').length;
  const ngoCount = users.filter((u) => u.role === 'ngo').length;

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="dashboard-header">
        <div>
          <h1>User Management</h1>
          <p>View and manage all registered users on the platform</p>
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-card">
          <h3>Total Users</h3>
          <p className="summary-value">{totalUsers}</p>
        </div>
        <div className="summary-card">
          <h3>Donors</h3>
          <p className="summary-value">{donorCount}</p>
        </div>
        <div className="summary-card">
          <h3>NGOs</h3>
          <p className="summary-value">{ngoCount}</p>
        </div>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          {loading ? (
            <p>Loading...</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Activity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userDonations = donations.filter(
                    (d) => d.donor_id === user.id
                  );

                  return (
                    <tr key={user.id} className="fade-in">
                      <td>
                        <div className="table-cell-content">
                          <UserCheck size={18} color="#10b981" />
                          <strong>{user.name}</strong>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            user.role === 'donor'
                              ? 'status-available'
                              : 'status-collected'
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {user.role === 'donor'
                          ? `${userDonations.length} donations`
                          : `NGO Account`}
                      </td>
                      <td>
                        <span className="status-badge status-collected">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;

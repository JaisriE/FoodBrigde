import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import DonorDashboard from './pages/donor/DonorDashboard';
import AddDonation from './pages/donor/AddDonation';
import MyDonations from './pages/donor/MyDonations';
import DonorImpact from './pages/donor/DonorImpact';

import NGODashboard from './pages/ngo/NGODashboard';
import AvailableDonations from './pages/ngo/AvailableDonations';
import CollectedDonations from './pages/ngo/CollectedDonations';
import NGOImpact from './pages/ngo/NGOImpact';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDonations from './pages/admin/AdminDonations';
import AdminImpact from './pages/admin/AdminImpact';

import './App.css';


// ✅ UPDATED ProtectedRoute WITH LOADING
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Wait until Supabase checks session
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user after loading → redirect
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* DONOR ROUTES */}
      <Route
        path="/donor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/add-donation"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <AddDonation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/my-donations"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <MyDonations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/impact"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorImpact />
          </ProtectedRoute>
        }
      />

      {/* NGO ROUTES */}
      <Route
        path="/ngo/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <NGODashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/available"
        element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <AvailableDonations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/collected"
        element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <CollectedDonations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/impact"
        element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <NGOImpact />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/donations"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDonations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/impact"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminImpact />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

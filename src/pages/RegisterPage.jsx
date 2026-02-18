import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Mail, Lock, User, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await register(name, email, password, role);
      setNotification({ type: 'success', message: 'Registration successful!' });

      setTimeout(() => {
        if (user.role === 'donor') {
          navigate('/donor/dashboard');
        } else if (user.role === 'ngo') {
          navigate('/ngo/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      }, 1000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Registration failed. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-branding">
            <Leaf size={48} color="#10b981" />
            <h1>Join Us Today</h1>
            <p>Register to start contributing to a sustainable future</p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">
                  <User size={18} />
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={18} />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">
                  <UserCheck size={18} />
                  Select Your Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="donor">Food Donor</option>
                  <option value="ngo">NGO / Organization</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <button type="submit" className="btn-primary full-width" disabled={loading}>
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">Login here</Link>
              </p>
              <Link to="/" className="auth-link">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);

      const role = user?.user_metadata?.role || "donor";


      console.log("Logged in role:", role);

      setNotification({ type: 'success', message: 'Login successful!' });

      setTimeout(() => {
        if (role === 'donor') {
          navigate('/donor/dashboard');
        } 
        else if (role === 'ngo') {
          navigate('/ngo/dashboard');
        } 
        else if (role === 'admin') {
          navigate('/admin/dashboard');
        } 
        else {
          alert("Role not found. Please re-register properly.");
        }
      }, 1000);

    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: error.message });
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
            <h1>Welcome Back</h1>
            <p>Login to continue making an impact on food waste reduction</p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2>Login</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary full-width"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Register here
                </Link>
              </p>
              <Link to="/" className="auth-link">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Users, TrendingUp, Recycle, Package } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalFood: 0,
    totalUsers: 0,
    totalCO2: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: donations } = await supabase
      .from('donations')
      .select('quantity');

    const { data: users } = await supabase.from('users').select('id');

    const totalFood =
      donations?.reduce((sum, d) => sum + Number(d.quantity), 0) || 0;

    const totalCO2 = totalFood * 2.5;

    setStats({
      totalFood,
      totalUsers: users?.length || 0,
      totalCO2,
    });
  };

  return (
    <div className="landing-page">
      {/* HEADER */}
      <header className="landing-header">
        <div className="logo">
          <Leaf size={32} color="#10b981" />
          <span>Smart Food Redistribution</span>
        </div>

        <div className="header-buttons">
          <button className="btn-secondary" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Smart Food Waste Redistribution & Composting System</h1>
          <p className="hero-subtitle">
            Connecting food donors with NGOs to reduce waste, fight hunger, and
            protect our environment.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        </div>

        {/* 🔥 DYNAMIC STATS */}
        <div className="hero-stats">
          <div className="stat-item">
            <Recycle size={40} color="#10b981" />
            <h3>{stats.totalFood.toFixed(1)} kg</h3>
            <p>Food Saved</p>
          </div>

          <div className="stat-item">
            <Users size={40} color="#10b981" />
            <h3>{stats.totalUsers}</h3>
            <p>Active Users</p>
          </div>

          <div className="stat-item">
            <TrendingUp size={40} color="#10b981" />
            <h3>{stats.totalCO2.toFixed(1)} kg</h3>
            <p>CO₂ Reduced</p>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="problem-section">
        <h2>The Global Food Waste Problem</h2>
        <p className="section-subtitle">
          Food waste is one of the biggest environmental and social challenges
          worldwide.
        </p>

        <div className="problem-grid">
          <div className="problem-card">
            <Package size={40} color="#ef4444" />
            <h3>1.3 Billion Tons</h3>
            <p>Food wasted globally every year</p>
          </div>

          <div className="problem-card">
            <TrendingUp size={40} color="#ef4444" />
            <h3>8–10%</h3>
            <p>Global greenhouse gas emissions come from food waste</p>
          </div>

          <div className="problem-card">
            <Users size={40} color="#ef4444" />
            <h3>828 Million</h3>
            <p>People suffer from hunger worldwide</p>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="solution-section">
        <h2>Our Smart Solution</h2>
        <p className="section-subtitle">
          A technology-driven bridge between surplus food and hungry
          communities.
        </p>

        <div className="solution-grid">
          <div className="solution-card">
            <Users size={32} color="#10b981" />
            <h3>Connect Donors & NGOs</h3>
            <p>
              Restaurants, supermarkets, and households can instantly register
              surplus food.
            </p>
          </div>

          <div className="solution-card">
            <Recycle size={32} color="#10b981" />
            <h3>Prevent Waste</h3>
            <p>
              NGOs collect food before spoilage, reducing landfill waste and
              methane emissions.
            </p>
          </div>

          <div className="solution-card">
            <TrendingUp size={32} color="#10b981" />
            <h3>Track Environmental Impact</h3>
            <p>
              Real-time calculation of CO₂ and methane reduction for
              transparency and reporting.
            </p>
          </div>
        </div>
      </section>

      {/* SDG SECTION */}
      <section className="sdg-section">
        <h2>UN Sustainable Development Goals Alignment</h2>

        <div className="sdg-grid">
          <div className="sdg-card">
            <h3>SDG 2 – Zero Hunger</h3>
            <p>
              Redistributing surplus food directly supports food security and
              reduces hunger in vulnerable communities.
            </p>
          </div>

          <div className="sdg-card">
            <h3>SDG 12 – Responsible Consumption & Production</h3>
            <p>
              Reduces food waste and promotes sustainable consumption through
              circular economy principles.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <h2>Ready to Make an Impact?</h2>
        <p>Join our platform and contribute to a sustainable future today.</p>
        <button
          className="btn-primary large"
          onClick={() => navigate('/register')}
        >
          Register Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Leaf size={24} color="#10b981" />
            <span>Smart Food Redistribution</span>
          </div>
          <p>© 2026 Smart Food Redistribution System</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

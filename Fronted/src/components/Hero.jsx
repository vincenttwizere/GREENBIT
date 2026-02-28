import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-label">
          FOOD REDISTRIBUTION PLATFORM
        </p>
        <h1 className="hero-title">
          Transforming Surplus Food into Social Impact
        </h1>
        <p className="hero-text">
          Green Bit Foundation connects hotels and restaurants with verified collectors to
          safely redistribute surplus food, reduce waste, and maximize community benefit.
        </p>
        <div className="hero-actions">
          <button
            onClick={() => navigate('/register?role=restaurant')}
            className="hero-button hero-button-primary"
          >
            Join as Restaurant
          </button>
          <button
            onClick={() => navigate('/register?role=collector')}
            className="hero-button hero-button-secondary"
          >
            Join as Collector
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;


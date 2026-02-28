import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    label: 'GREENBIT FOUNDATION',
    title: 'CHILDREN NEED YOUR HELP',
    text: 'Children, including infants and toddlers, face heightened vulnerability to nutritional deficiencies due to their rapid growth. Essential for development, these nutritional needs, if unmet, can have lasting consequences on health.',
  },
  {
    label: 'GREENBIT FOUNDATION',
    title: 'ELDERLY NEED YOUR HELP',
    text: 'Older adults may encounter obstacles in accessing and preparing nutritious meals, given specific nutritional needs associated with aging. Meeting these requirements becomes crucial for the well-being of elderly individuals.',
  },
  {
    label: 'GREENBIT FOUNDATION',
    title: 'PREGNANT WOMAN NEED YOUR HELP',
    text: 'Pregnant women have increased nutritional needs to support the growth and development of the fetus. Nutritional vulnerabilities during pregnancy can have long-term consequences for both the mother and the child.',
  },
  {
    label: 'GREENBIT FOUNDATION',
    title: 'PEOPLE WITH CLONICAL ILLNESS NEED YOUR HELP',
    text: 'Individuals with chronic illnesses often require heightened nutritional support. Certain health conditions can impact the absorption and utilization of nutrients. Addressing these specific needs is crucial for maintaining optimal health in individuals dealing with chronic illnesses.',
  },
  {
    label: 'GREENBIT FOUNDATION',
    title: 'INDIVIDUAL WITH EATING DISORDER NEEDS YOUR HELP',
    text: 'Eating disorders can impact the absorption and utilization of nutrients. Addressing these specific needs is crucial for maintaining optimal health in individuals dealing with eating disorders.',
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay" />
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === activeIndex ? 'hero-slide-active' : ''}`}
          >
            <div className="hero-content">
              <p className="hero-label">{slide.label}</p>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-text">{slide.text}</p>
              <div className="hero-actions">
                <button
                  onClick={() => navigate('/register')}
                  className="hero-button hero-button-white"
                >
                  DONATE NOW
                </button>
                <a href="#contact" className="hero-button hero-button-outline">
                  CONTACT US
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`hero-dot ${index === activeIndex ? 'hero-dot-active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;


const ICONS = {
  report: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 10h12M10 3h4" />
    </svg>
  ),
  match: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 0 1 0-7l.9-.9a5 5 0 0 1 7 7l-.9.9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 0 1 0 7l-.9.9a5 5 0 0 1-7-7l.9-.9" />
    </svg>
  ),
  deliver: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v10H3V7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h3.5L21 13.5V17h-7v-7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  ),
};

const steps = [
  {
    title: 'Report Surplus',
    description:
      'Restaurants log surplus food in a few clicks, including quantity, expiry, and pickup window.',
    icon: ICONS.report,
  },
  {
    title: 'Smart Matching',
    description:
      'Verified collectors are automatically matched based on location and availability.',
    icon: ICONS.match,
  },
  {
    title: 'Safe Delivery',
    description:
      'Collectors follow safe handling standards to deliver food to trusted community partners.',
    icon: ICONS.deliver,
  },
];

const HowItWorks = () => {
  return (
    <section id="services" className="how-section">
      <div className="how-container">
        <div className="how-header">
          <h2 className="how-title">How It Works</h2>
          <p className="how-subtitle">
            A streamlined, impact-first workflow designed for busy hospitality teams.
          </p>
        </div>
        <div className="how-grid">
          {steps.map((step) => (
            <div
              key={step.title}
              className="how-card"
            >
              <div className="how-card-glow" />
              <div className="how-card-topbar" />

              <div className="how-card-icon">
                {step.icon}
              </div>
              <h3 className="how-card-title">{step.title}</h3>
              <p className="how-card-text">{step.description}</p>

              <div className="how-card-footer">
                <span className="how-card-dot" />
                <span>Designed for speed and safety</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;


const partners = ['GreenStay Hotels', 'Urban Harvest Group', 'EcoFleet Logistics', 'City Fresh Markets'];

const Partners = () => {
  return (
    <section id="about" className="partners-section">
      <div className="partners-container">
        <div className="partners-header">
          <div>
            <h2 className="partners-title">
              Trusted Sustainability Partners
            </h2>
            <p className="partners-subtitle">
              We work with hospitality groups, logistics teams, and community organizations
              committed to closing the food waste loop.
            </p>
          </div>
        </div>
        <div className="partners-grid">
          {partners.map((name) => (
            <div
              key={name}
              className="partners-card"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;


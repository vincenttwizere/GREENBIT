const ICONS = {
  location: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243m8.534 0l4.243-4.244a2 2 0 00-2.828-2.828L9.172 7.172M5 12a7 7 0 1114 0" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 12.75h2.25m0 0h2.25m-2.25 0C12.75 12.75 12 12 12 11.25s.75-1.5 1.5-1.5h2.25c.75 0 1.5.75 1.5 1.5s-.75 1.5-1.5 1.5m6-9H15.75a1.5 1.5 0 00-1.5 1.5v12.75c0 .75.75 1.5 1.5 1.5h6.75c.75 0 1.5-.75 1.5-1.5V4.5c0-.75-.75-1.5-1.5-1.5z" />
    </svg>
  ),
};

const services = [
  {
    icon: ICONS.location,
    title: 'Food Rescue',
    description:
      'Our foundation tackles food waste through efficient food redistribution, collecting surplus from restaurants and hotels. By redirecting excess food to those in need.',
  },
  {
    icon: ICONS.heart,
    title: 'Social Services',
    description:
      'Our foundation is committed to offering more than just immediate relief. We go beyond addressing physical needs by providing essential emotional and psychological support.',
  },
  {
    icon: ICONS.dashboard,
    title: 'Environment Safety',
    description:
      'Our foundation is committed to addressing the environmental impacts of food waste. By collecting the food remains from restaurants and hotels and supply them to those in need.',
  },
];

const Services = () => {
  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">OUR SERVICES</h2>
          <p className="services-intro">
            In Kigali, Rwanda, we address the dual challenge of food waste and scarcity. While restaurants discard surplus food, many children's homes lack resources to meet dietary needs. Join us in minimizing waste and supporting those in need.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.title} className="services-card">
              <div className="services-card-glow" />
              <div className="services-card-topbar" />
              <div className="services-card-icon">
                {service.icon}
              </div>
              <h3 className="services-card-title">{service.title}</h3>
              <p className="services-card-text">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

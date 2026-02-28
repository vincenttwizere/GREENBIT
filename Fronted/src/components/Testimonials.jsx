const testimonials = [
  {
    name: 'Elena Rossi',
    role: 'Hotel Operations Manager',
    quote:
      'Green Bit Foundation turned our nightly surplus into thousands of meals delivered to local shelters.',
  },
  {
    name: 'David Kim',
    role: 'Food Collector Partner',
    quote:
      'The app makes it simple to plan efficient routes while ensuring food safety every step of the way.',
  },
  {
    name: 'Amina Yusuf',
    role: 'Community Kitchen Lead',
    quote:
      'We now receive consistent, high-quality donations that let us serve more families than ever.',
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">
            What Our Users Say
          </h2>
          <p className="testimonials-subtitle">
            Stories from our hotel, restaurant, and community partners.
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="testimonial-card"
            >
              <div className="testimonial-glow" />
              <div className="testimonial-inner">
                <div className="testimonial-pill">
                  <span className="testimonial-pill-dot" />
                  Verified impact partner
                </div>
                <blockquote className="testimonial-quote">
                  <span className="testimonial-quote-mark">“</span>
                  {t.quote}
                  <span className="testimonial-quote-mark">”</span>
                </blockquote>
              </div>
              <figcaption className="testimonial-footer">
                <div className="testimonial-user">
                  <div className="testimonial-avatar">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="testimonial-user-text">
                    <div className="testimonial-user-name">{t.name}</div>
                    <div className="testimonial-user-role">{t.role}</div>
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;


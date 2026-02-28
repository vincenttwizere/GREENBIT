const ContactSection = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-grid">
          <div>
            <h2 className="contact-title">Contact Us</h2>
            <p className="contact-text">
              Ready to reduce food waste at scale? Our team can help you roll out
              Green Bit Foundation across multiple sites and cities.
            </p>
            <div className="contact-details">
              <p>
                <span className="contact-details-label">
                  Email:
                </span>{' '}
                partnerships@greenbit.org
              </p>
              <p>
                <span className="contact-details-label">
                  Impact Hotline:
                </span>{' '}
                +1 (555) 123-4567
              </p>
              <p>
                <span className="contact-details-label">
                  Headquarters:
                </span>{' '}
                42 Evergreen Way, Green City
              </p>
            </div>
          </div>
          <div>
            <form className="contact-form">
              <div>
                <label
                  htmlFor="name"
                  className="contact-label"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="contact-input"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="contact-label"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="contact-input"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="contact-label"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="contact-input contact-textarea"
                  placeholder="Tell us about your food operations..."
                />
              </div>
              <button
                type="submit"
                className="contact-submit"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;


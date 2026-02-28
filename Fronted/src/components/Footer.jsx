const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <h3 className="footer-heading">
              Our Mission
            </h3>
            <p className="footer-text">
              Green Bit Foundation connects surplus food with communities that need it most,
              turning everyday operations into measurable environmental and social impact.
            </p>
          </div>
          <div>
            <h3 className="footer-heading">
              Quick Links
            </h3>
            <ul className="footer-links">
              <li>
                <a href="#about" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="footer-heading">
              Connect
            </h3>
            <div className="footer-social">
              <span className="footer-social-icon">
                in
              </span>
              <span className="footer-social-icon">
                X
              </span>
              <span className="footer-social-icon">
                ig
              </span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © {year} Green Bit Foundation. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;


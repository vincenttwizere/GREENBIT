import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Partners from '../components/Partners.jsx';
import ContactSection from '../components/ContactSection.jsx';
import Footer from '../components/Footer.jsx';

const LandingPage = () => {
  return (
    <div className="page-landing">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Testimonials />
        <Partners />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;


import React, { useEffect } from 'react'; // Import useEffect
import Contact from '../components/Contact';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20">
      <Contact />
    </div>
  );
};

export default ContactPage;

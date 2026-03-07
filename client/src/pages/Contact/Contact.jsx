import React from "react";
import SocialIcon from "../../components/socialIcon/SocialIcon";
import ContactInfoCard from "../../components/contactInfoCard/ContactInfoCard";
import ContactForm from "../../components/contactform/ContactForm";

const Contact = () => {
  return (
    <div className="bg-gray-100 px-4 py-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Left Side: Contact Info */}
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            We’d love to hear from you! Whether you have questions, feedback, or want to work with us, send us a message or reach out via social media.
          </p>

          <div className="space-y-4">
            <ContactInfoCard icon="FaMapMarkerAlt" title="Address" text="123 Main Street, Swat, KPK, Pakistan" />
            <ContactInfoCard icon="FaPhoneAlt" title="Phone" text="+92 300 1234567" />
            <ContactInfoCard icon="FaEnvelope" title="Email" text="support@findhome.com" />
          </div>

          <div className="flex space-x-4 mt-6">
            <SocialIcon icon="FaFacebookF" link="https://facebook.com" />
            <SocialIcon icon="FaTwitter" link="https://twitter.com" />
            <SocialIcon icon="FaLinkedinIn" link="https://linkedin.com" />
            <SocialIcon icon="FaInstagram" link="https://instagram.com" />
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  // --- JS Validation State ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "Buy a Home",
    message: ""
  });
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data Submitted Successfully:", formData);
      alert("Thank you! Your message has been sent.");
      // Reset form
      setFormData({ fullName: "", email: "", subject: "Buy a Home", message: "" });
    }
  };

  return (
    <div className="font-sans text-[#101828] bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')`, backgroundAttachment: "fixed" }}>
        <div className="absolute inset-0 bg-slate-900/60"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Get In <span className="text-[#f36c3a]">Touch</span></h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 px-6 lg:px-32">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          
          {/* Left Side: Contact Info */}
          <div className="lg:w-1/3 space-y-10">
            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <ContactInfoItem icon={<FaPhoneAlt />} title="Phone" detail="+1 (555) 000-1234" />
              <ContactInfoItem icon={<FaEnvelope />} title="Email" detail="info@findhome.com" />
              <ContactInfoItem icon={<FaMapMarkerAlt />} title="Location" detail="123 Luxury Lane, NY" />
            </div>

            {/* Social Media with Hover Effects */}
            <div className="pt-6 border-t border-slate-100">
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <SocialIcon icon={<FaFacebook />} label="Facebook" color="hover:bg-blue-600" />
                <SocialIcon icon={<FaTwitter />} label="Twitter" color="hover:bg-sky-400" />
                <SocialIcon icon={<FaLinkedin />} label="LinkedIn" color="hover:bg-blue-700" />
                <SocialIcon icon={<FaInstagram />} label="Instagram" color="hover:bg-pink-600" />
              </div>
            </div>
          </div>

          {/* Right Side: Validated Form */}
          <div className="lg:w-2/3">
            <div className="bg-[#fef7f6] p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold mb-8">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <input 
                    name="fullName" value={formData.fullName} onChange={handleInputChange}
                    type="text" placeholder="Your Name" 
                    className={`w-full px-5 py-4 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-slate-200'} focus:border-[#f36c3a] outline-none transition-all`} 
                  />
                  {errors.fullName && <p className="text-red-500 text-xs font-semibold">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input 
                    name="email" value={formData.email} onChange={handleInputChange}
                    type="email" placeholder="Your Email" 
                    className={`w-full px-5 py-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200'} focus:border-[#f36c3a] outline-none transition-all`} 
                  />
                  {errors.email && <p className="text-red-500 text-xs font-semibold">{errors.email}</p>}
                </div>

                {/* Subject */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-[#f36c3a] outline-none bg-white">
                    <option>Buy a Home</option>
                    <option>Rent a Home</option>
                    <option>Property Management</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <textarea 
                    name="message" value={formData.message} onChange={handleInputChange}
                    rows="5" placeholder="How can we help you?" 
                    className={`w-full px-5 py-4 rounded-xl border ${errors.message ? 'border-red-500' : 'border-slate-200'} focus:border-[#f36c3a] outline-none transition-all resize-none`}
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs font-semibold">{errors.message}</p>}
                </div>

                <div className="md:col-span-2 pt-4">
                  <button type="submit" className="w-full md:w-auto bg-[#f36c3a] text-white px-12 py-4 rounded-full font-bold shadow-lg hover:bg-slate-900 hover:scale-105 transition-all active:scale-95">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
       {/* 3. Embedded Map Section (Placeholder) */}
      <section className="h-[450px] w-full bg-slate-200 grayscale hover:grayscale-0 transition-all duration-700">
        <iframe 
          title="Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215707164965!2d-73.985428!3d40.748817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU1LjciTiA3M8KwNTknMDcuNSJX!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus"
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
};

// --- Helper Components ---

const ContactInfoItem = ({ icon, title, detail }) => (
  <div className="flex items-start gap-4">
    <div className="bg-[#fef7f6] p-4 rounded-2xl text-[#f36c3a]">{icon}</div>
    <div>
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="text-[#667085]">{detail}</p>
    </div>
  </div>
);

const SocialIcon = ({ icon, color }) => (
  <div className={`relative group w-12 h-12 bg-white border border-slate-100 flex items-center justify-center rounded-xl text-slate-600 transition-all duration-300 shadow-sm cursor-pointer hover:text-white hover:shadow-xl hover:-translate-y-2 ${color}`}>
    <span className="text-xl group-hover:scale-125 transition-transform duration-300">
      {icon}
    </span>
    {/* Subtle Tooltip Effect */}
    <span className="absolute -top-10 scale-0 group-hover:scale-100 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all">
      Follow
    </span>
  </div>
);

export default Contact;
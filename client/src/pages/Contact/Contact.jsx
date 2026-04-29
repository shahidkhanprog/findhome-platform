// pages/Contact.jsx
import React, { useState } from "react";
import {
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram,
  FaCheckCircle, FaWhatsapp,
} from "react-icons/fa";
import apiRequest from "../../lib/apiRequest";
import CollegeMap from "../../components/common/CollegeMap";

// ── Contact info data ─────────────────────────────────────────
const CONTACT_INFO = [
  {
    icon: <FaPhoneAlt />,
    title: "Call Us Directly",
    detail: "+92 344 988 5555",
    sub: "Mon – Sat, 9 AM – 7 PM PKT",
    link: "tel:+923449885555",
    linkLabel: "Call Now",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: <FaWhatsapp />,
    title: "WhatsApp",
    detail: "+92 317 067 8832",
    sub: "Quick replies within minutes",
    link: "https://wa.me/923170678832",
    linkLabel: "Chat on WhatsApp",
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    icon: <FaEnvelope />,
    title: "Email Us",
    detail: "info@findhome.com",
    sub: "We reply within 24 hours",
    link: "mailto:info@findhome.com",
    linkLabel: "Send Email",
    color: "bg-orange-50 text-[#f36c3a]",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Visit Our Office",
    detail: "Teh Kabal Dist Swat, Khyber Pakhtunkhwa, Pakistan",
    sub: "Open Mon – Sat, 9 AM – 6 PM",
    link: "#map",
    linkLabel: "View on Map",
    color: "bg-purple-50 text-purple-500",
  },
];

const SOCIAL = [
  { icon: <FaFacebook />, label: "Facebook", color: "hover:bg-blue-600", href: "https://www.facebook.com/shahidkhanprog" },
  { icon: <FaTwitter />, label: "Twitter", color: "hover:bg-sky-400", href: "https://twitter.com/shahidkhanprog" },
  { icon: <FaLinkedin />, label: "LinkedIn", color: "hover:bg-blue-700", href: "https://www.linkedin.com/in/shahidkhanprog" },
  { icon: <FaInstagram />, label: "Instagram", color: "hover:bg-pink-600", href: "https://www.instagram.com/shahidkhanprog" },
];

const SUBJECTS = [
  "Buy a Property",
  "Rent a Property",
  "Sell My Property",
  "Property Management",
  "Investment Advisory",
  "Legal & Documentation",
  "General Inquiry",
];

// ── Contact Info Card ─────────────────────────────────────────
const ContactInfoCard = ({ icon, title, detail, sub, link, linkLabel, color }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4 items-start hover:shadow-md transition-all duration-300">
    <div className={`p-3 rounded-xl shrink-0 ${color}`}>
      <span className="text-xl">{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">
        {title}
      </p>
      <p className="font-bold text-slate-900 text-sm sm:text-base truncate">
        {detail}
      </p>
      <p className="text-slate-400 text-xs mt-0.5 mb-2">{sub}</p>
      <a
        href={link}
        target={link.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        className="text-[#f36c3a] text-xs font-bold hover:underline"
      >
        {linkLabel} →
      </a>
    </div>
  </div>
);

// ── Social Icon ───────────────────────────────────────────────
const SocialIcon = ({ icon, label, color, href }) => (
  <a
    href={href}
    aria-label={label}
    className={`relative group w-11 h-11 bg-white border border-slate-100 flex items-center justify-center rounded-xl text-slate-500 transition-all duration-300 shadow-sm hover:text-white hover:shadow-xl hover:-translate-y-1 ${color}`}
  >
    <span className="text-lg group-hover:scale-125 transition-transform duration-300">
      {icon}
    </span>
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
      {label}
    </span>
  </a>
);

// ── Field wrapper with label, input slot, and error ───────────
const FormField = ({ label, required, optional, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs sm:text-sm font-bold text-slate-700">
      {label}{" "}
      {required && <span className="text-rose-400">*</span>}
      {optional && (
        <span className="text-slate-400 font-normal ml-1">(optional)</span>
      )}
    </label>
    {children}
    {error && (
      <p className="text-red-500 text-xs font-semibold">{error}</p>
    )}
  </div>
);

// ── Main Contact Page ─────────────────────────────────────────
const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "Buy a Property",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Input handler with dynamic trimming ──────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let cleaned = value;

    // Strip leading spaces dynamically on all text fields
    if (name !== "subject") {
      cleaned = value.replace(/^\s+/, "");
    }

    setFormData((prev) => ({ ...prev, [name]: cleaned }));

    // Clear the field error as user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  // ── Client-side validation ────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required";

    if (!formData.email.trim())
      newErrors.email = "Email address is required";
    else if (!emailRegex.test(formData.email.trim()))
      newErrors.email = "Please enter a valid email address";

    if (!formData.message.trim())
      newErrors.message = "Message cannot be empty";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim all values before sending
    const trimmed = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      subject: formData.subject,
      message: formData.message.trim(),
    };

    // Sync trimmed values back to state
    setFormData((prev) => ({ ...prev, ...trimmed }));

    if (!validate()) return;

    setLoading(true);
    setApiError("");

    try {
      await apiRequest.post("/contact", trimmed);
      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "Buy a Property",
        message: "",
      });
      setErrors({});
    } catch (err) {
      const { status, data } = err.response ?? {};
      const msg = data?.message || "Failed to send message. Please try again.";

      // ✅ Field-specific errors from backend
      if (status === 400 && data?.field) {
        setErrors((prev) => ({ ...prev, [data.field]: msg }));
        return;
      }

      // General error banner for anything else
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans text-[#101828] bg-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative h-[45vh] sm:h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900/50" />
        <div className="relative z-10 text-center text-white px-5 sm:px-8 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-3">
            We're Here to Help
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Get In <span className="text-[#f36c3a]">Touch</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Whether you're buying, renting, or investing — our team is ready
            to guide you every step of the way.
          </p>
        </div>
      </section>

      {/* ── Contact Info Cards ────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-5 sm:px-8 lg:px-20 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CONTACT_INFO.map((item, i) => (
            <ContactInfoCard key={i} {...item} />
          ))}
        </div>
      </section>

      {/* ── Main Content: Info + Form ─────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 px-5 sm:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* ── Left: Info + social ────────────────────────────── */}
          <div className="lg:w-5/12 space-y-8">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-2">
                Contact Us
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                Let's Find Your{" "}
                <span className="text-[#f36c3a]">Perfect Property</span> Together
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                Our team of verified agents across Islamabad, Lahore, Peshawar,
                and Rawalpindi is ready to help. No bots — a real person will
                respond to every inquiry within 24 hours.
              </p>
            </div>

            {/* Why contact us */}
            <div className="bg-[#fef7f6] rounded-2xl border border-[#f36c3a]/20 p-5 sm:p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Why reach out to us?
              </p>
              {[
                "Free consultation — no commitment required",
                "Dedicated agent assigned within 2 hours",
                "Access to 100+ off-market listings",
                "Full legal & documentation support",
                "Transparent pricing, zero hidden fees",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FaCheckCircle className="text-[#f36c3a] shrink-0 mt-0.5 text-sm" />
                  <p className="text-slate-600 text-xs sm:text-sm">{point}</p>
                </div>
              ))}
            </div>

            {/* Office hours */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                Office Hours
              </p>
              {[
                { day: "Monday – Friday", hours: "9:00 AM – 7:00 PM" },
                { day: "Saturday", hours: "10:00 AM – 5:00 PM" },
                { day: "Sunday", hours: "Closed" },
              ].map((row, i) => (
                <div
                  key={i}
                  className={`flex justify-between text-xs sm:text-sm py-2.5 ${i < 2 ? "border-b border-slate-100" : ""
                    }`}
                >
                  <span className="font-bold text-slate-700">{row.day}</span>
                  <span className={
                    row.hours === "Closed"
                      ? "text-rose-400 font-bold"
                      : "text-slate-500"
                  }>
                    {row.hours}
                  </span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Follow Us
              </p>
              <div className="flex gap-3">
                {SOCIAL.map((s, i) => (
                  <SocialIcon key={i} {...s} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Form ────────────────────────────────────── */}
          <div className="lg:w-7/12">
            <div className="bg-[#fef7f6] p-6 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">

              {submitted ? (
                /* ── Success state ── */
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-emerald-500 text-3xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 text-sm sm:text-base max-w-sm leading-relaxed">
                    Thank you for reaching out. A dedicated agent will contact
                    you within 24 hours to discuss your requirements.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 bg-[#f36c3a] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95 text-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-2">
                    Send a Message
                  </p>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6 sm:mb-8">
                    How Can We Help You?
                  </h3>

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
                  >
                    {/* Full Name */}
                    <FormField label="Full Name" required error={errors.fullName}>
                      <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="e.g. Ahmed Raza"
                        className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border text-sm focus:outline-none transition-all ${errors.fullName
                            ? "border-red-400 bg-red-50"
                            : "border-slate-200 bg-white focus:border-[#f36c3a]"
                          }`}
                      />
                    </FormField>

                    {/* Email */}
                    <FormField label="Email Address" required error={errors.email}>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email"
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border text-sm focus:outline-none transition-all ${errors.email
                            ? "border-red-400 bg-red-50"
                            : "border-slate-200 bg-white focus:border-[#f36c3a]"
                          }`}
                      />
                    </FormField>

                    {/* Phone */}
                    <FormField label="Phone Number" optional>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        type="tel"
                        placeholder="+92 300 000 0000"
                        className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#f36c3a] transition-all"
                      />
                    </FormField>

                    {/* Subject */}
                    <FormField label="Subject">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#f36c3a] transition-all cursor-pointer"
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </FormField>

                    {/* Message */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs sm:text-sm font-bold text-slate-700">
                        Message <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        maxLength={500}
                        placeholder="Tell us what you're looking for — property type, budget, location, timeline..."
                        className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border text-sm focus:outline-none transition-all resize-none ${errors.message
                            ? "border-red-400 bg-red-50"
                            : "border-slate-200 bg-white focus:border-[#f36c3a]"
                          }`}
                      />
                      <div className="flex items-center justify-between">
                        {errors.message ? (
                          <p className="text-red-500 text-xs font-semibold">
                            {errors.message}
                          </p>
                        ) : (
                          <span />
                        )}
                        <p className={`text-xs ml-auto ${formData.message.length >= 480
                            ? "text-rose-400 font-semibold"
                            : "text-slate-400"
                          }`}>
                          {formData.message.length} / 500
                        </p>
                      </div>
                    </div>

                    {/* General API error */}
                    {apiError && (
                      <div className="sm:col-span-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <p className="text-red-500 text-sm font-semibold text-center">
                          {apiError}
                        </p>
                      </div>
                    )}

                    {/* Submit */}
                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-[#f36c3a] hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-10 sm:px-14 py-3.5 sm:py-4 rounded-full shadow-lg shadow-orange-200 hover:shadow-xl transition-all active:scale-95 text-sm sm:text-base flex items-center gap-3"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          "Send Message →"
                        )}
                      </button>
                      <p className="text-xs text-slate-400 mt-3">
                        By submitting, you agree to our privacy policy. We never share your data.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Embedded Map ─────────────────────────────────────── */}
      <section
        id="map"
        className="h-[300px] sm:h-[400px] w-full bg-slate-200 grayscale hover:grayscale-0 transition-all duration-700">
        <CollegeMap />
      </section>
    </div>
  );
};

export default Contact;
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Find<span className="text-blue-500">Home</span>
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Your trusted platform for finding the perfect home. Browse thousands
            of listings with ease and confidence.
          </p>

          {/* Socials */}
          <div className="flex space-x-3 pt-2">
            {[
              { icon: <FaFacebookF />, href: "https://www.facebook.com/shahidkhanprog" },
              { icon: <FaTwitter />, href: "https://twitter.com/shahidkhanprog" },
              { icon: <FaInstagram />, href: "https://www.instagram.com/shahidkhanprog" },
              { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/in/shahidkhanprog" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-9 h-9 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center text-sm transition-colors duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg border-b border-gray-700 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Home", to: "/" },
              { label: "About Us", to: "/about" },
              { label: "Listings", to: "/list" },
              { label: "Contact", to: "/contact" },
            ].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  → {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Property Types */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg border-b border-gray-700 pb-2">
            Property Types
          </h3>
          <ul className="space-y-2 text-sm">
            {["Apartments", "Commercial", "Homes", "Land"].map((type) => (
              <li key={type}>
                {/* Update 'to' when you create these pages */}
                <NavLink
                  // to={`/properties/${type.toLowerCase()}`}
                  to={`#`}
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  → {type}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg border-b border-gray-700 pb-2">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-blue-500 mt-1 shrink-0" />
              <span className="text-gray-400">
                Teh Kabal Dist Swat, Khyber Pakhtunkhwa, Pakistan
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-blue-500 shrink-0 rotate-90" />
              <a
                href="tel:+923449885555"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                +92 344 988 5555
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-blue-500 shrink-0 rotate-90" />
              <a
                href="tel:+923170678832"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                +92 317 067 8832
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-blue-500 shrink-0" />
              <a
                href="mailto:info@findhome.com"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                info@findhome.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} FindHome. All rights reserved.</p>
          <div className="flex space-x-5">
            <NavLink
              to="/privacy-policy"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/terms-of-service"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Terms of Service
            </NavLink>
            <NavLink
              to="/sitemap"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Sitemap
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

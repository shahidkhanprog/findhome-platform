import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const linkClasses = ({ isActive }) =>
    `transition-colors duration-300 font-medium ${
      isActive ? "text-blue-500 font-semibold" : "text-gray-300 hover:text-blue-500"
    }`;

  return (
    <nav className="bg-gray-900 shadow-md w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-white">
            Find<span className="text-blue-500">Home</span>
          </NavLink>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 font-medium items-center">
            {[
              { label: "Home", to: "/" },
              { label: "About Us", to: "/about" },
              { label: "Listings", to: "/list" },
              { label: "Contact", to: "/contact" },
            ].map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium border transition-colors duration-300 text-center ${
                  isActive
                    ? "bg-blue-100 border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-300 hover:bg-gray-800 hover:text-blue-500"
                }`
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-white transition-colors duration-300 text-center ${
                  isActive
                    ? "bg-blue-700 hover:bg-blue-800"
                    : "bg-blue-500 hover:bg-blue-600"
                }`
              }
            >
              Register
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div
            className="md:hidden text-2xl text-gray-300 cursor-pointer"
            onClick={() => setMenuOpen(true)}
          >
            <FaBars />
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      />

      {/* Mobile Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">FindHome</h2>
          <FaTimes className="text-xl text-gray-300 cursor-pointer" onClick={closeMenu} />
        </div>

        <ul className="flex flex-col p-6 space-y-6 text-lg font-medium">
          {[
            { label: "Home", to: "/" },
            { label: "About Us", to: "/about" },
            { label: "Listings", to: "/list" },
            { label: "Contact", to: "/contact" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={linkClasses}
            >
              {link.label}
            </NavLink>
          ))}

          <hr className="border-gray-700" />

          {/* Mobile Auth Buttons */}
          <NavLink
            to="/login"
            onClick={closeMenu}
            className="px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-300 hover:bg-gray-800 hover:text-blue-500 text-center transition-colors duration-300"
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            onClick={closeMenu}
            className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 text-center transition-colors duration-300"
          >
            Register
          </NavLink>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
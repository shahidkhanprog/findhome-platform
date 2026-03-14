import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

// ─── Auth event bus ────────────────────────────────────────────────────────────
// Call authEvents.login() right after localStorage.setItem("user", ...) in your
// login page so the Navbar re-renders instantly — no page refresh needed.
export const authEvents = {
  login:  () => window.dispatchEvent(new Event("auth-change")),
  logout: () => window.dispatchEvent(new Event("auth-change")),
};

const readUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored)?.userData ?? null : null;
  } catch {
    return null;
  }
};

const Navbar = () => {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser]               = useState(readUser);   // reads localStorage on first render
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  // ── Sync user state without refresh ──────────────────────────────────────────
  // "auth-change"  → same-tab: your login/logout pages dispatch this via authEvents
  // "storage"      → cross-tab: browser fires this automatically when another tab
  //                  writes to localStorage, so opening a new tab also stays in sync
  useEffect(() => {
    const sync = () => setUser(readUser());
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage",     sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage",     sync);
    };
  }, []);

  // ── Close dropdown on outside click
  useEffect(() => {
    const onOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    authEvents.logout();          // triggers sync → hides avatar instantly
    setDropdownOpen(false);
    navigate("/");
  };

  const linkClasses = ({ isActive }) =>
    `transition-colors duration-300 font-medium ${
      isActive ? "text-blue-500 font-semibold" : "text-gray-300 hover:text-blue-500"
    }`;

  // ── Reusable avatar circle
  const Avatar = ({ size = "w-7 h-7", text = "text-xs" }) =>
    user?.avatar ? (
      <img
        src={user.avatar}
        alt={user.username}
        className={`${size} rounded-full object-cover flex-shrink-0`}
      />
    ) : (
      <span
        className={`${size} rounded-full bg-amber-500 text-white font-bold ${text} flex items-center justify-center uppercase flex-shrink-0`}
      >
        {user?.username?.charAt(0) || "U"}
      </span>
    );

  // ── Desktop trigger pill ──────────────────────────────────────────────────────
  const AvatarButton = () => (
    <button
      onClick={() => setDropdownOpen((p) => !p)}
      className="flex items-center gap-2 focus:outline-none group border border-gray-600 hover:border-gray-500 transition-colors duration-200 rounded-full pl-1 pr-2.5 py-1"
    >
      <Avatar />
      <span className="text-gray-300 text-sm font-medium group-hover:text-blue-400 transition-colors duration-200 leading-none">
        {user?.username}
      </span>
      <svg
        className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  // ── Desktop dropdown — dark theme matching navbar ─────────────────────────────
  const DropdownMenu = () => (
    <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">

      {/* User header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-700">
        <Avatar size="w-8 h-8" text="text-sm" />
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{user?.username}</p>
          <p className="text-gray-500 text-xs truncate">{user?.email}</p>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        {[
          {
            to: "/dashboard",
            label: "Dashboard",
            icon: (
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <rect x="3"  y="3"  width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="14" y="3"  width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3"  y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
          },
          {
            to: "/favorites",
            label: "Favorites",
            icon: (
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ),
          },
          {
            to: "/messages",
            label: "Messages",
            icon: (
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            ),
          },
        ].map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setDropdownOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-gray-700 py-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-150"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <nav className="bg-gray-900 shadow-md w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-white">
            Find<span className="text-blue-500">Home</span>
          </NavLink>

          {/* Desktop links */}
          <ul className="hidden md:flex space-x-8 font-medium items-center">
            {[
              { label: "Home",     to: "/" },
              { label: "About Us", to: "/about" },
              { label: "Listings", to: "/list" },
              { label: "Contact",  to: "/contact" },
            ].map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}
          </ul>

          {/* Desktop auth / user */}
          <div className="hidden md:flex space-x-4 items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <AvatarButton />
                {dropdownOpen && <DropdownMenu />}
              </div>
            ) : (
              <>
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
                      isActive ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-500 hover:bg-blue-600"
                    }`
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden text-2xl text-gray-300 cursor-pointer" onClick={() => setMenuOpen(true)}>
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

      {/* Mobile slide-in */}
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
            { label: "Home",     to: "/" },
            { label: "About Us", to: "/about" },
            { label: "Listings", to: "/list" },
            { label: "Contact",  to: "/contact" },
          ].map((link) => (
            <NavLink key={link.to} to={link.to} onClick={closeMenu} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}

          <hr className="border-gray-700" />

          {user ? (
            <>
              <div className="flex items-center gap-3">
                <Avatar size="w-10 h-10" text="text-base" />
                <div>
                  <p className="text-white font-semibold text-sm">{user.username}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>

              {[
                { to: "/dashboard", label: "Dashboard", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                { to: "/favorites", label: "Favorites",  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg> },
                { to: "/messages",  label: "Messages",   icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> },
              ].map(({ to, label, icon }) => (
                <NavLink key={to} to={to} onClick={closeMenu} className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors">
                  {icon}{label}
                </NavLink>
              ))}

              <button
                onClick={() => { handleLogout(); closeMenu(); }}
                className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors text-lg font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"    onClick={closeMenu} className="px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-300 hover:bg-gray-800 hover:text-blue-500 text-center transition-colors duration-300">Login</NavLink>
              <NavLink to="/register" onClick={closeMenu} className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 text-center transition-colors duration-300">Register</NavLink>
            </>
          )}
        </ul>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.18s ease-out; }
      `}</style>
    </nav>
  );
};

export default Navbar;

// import { Navigate, Outlet } from "react-router-dom";
// import Footer from "./Footer";
// import Header from "./Header";
// import { useContext, useEffect } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import UserDashboard from "../../pages/dashboard/UserDashboard";

// const UserDashboardLayout = () => {
//   const { currentUser } = useContext(AuthContext);

//   return !currentUser ? (<Navigate to="/login" />) : (
//     <>
//       <Header />
//       <UserDashboard />
//       <Outlet />
//       <Footer />
//     </>
//   );
// };
// export default UserDashboardLayout;

import { useState, useEffect, useContext, useRef } from "react";
import { Navigate, Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

/* ─── Nav items ─────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    path: "/dashboard/overview",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "myProperties",
    label: "My Properties",
    path: "/dashboard/myProperties",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    id: "addProperty",
    label: "Add Property",
    path: "/dashboard/addProperty",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    id: "favorites",
    label: "Saved Posts",
    path: "/dashboard/favorites",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    id: "messages",
    label: "Messages",
    path: "/dashboard/messages",
    badge: 2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    path: "/dashboard/profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

/* ─── Top Header ────────────────────────────────────────────────── */
const PUBLIC_LINKS = [
  { label: "Home",     to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Listings", to: "/listings" },
  { label: "Contact",  to: "/contact" },
];

function DashboardHeader({ user, onLogout }) {
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  return (
    <header
      style={{
        height: 64,
        background: "#0f172a",
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 24,
        position: "sticky",
        top: 0,
        zIndex: 50,
        flexShrink: 0,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Brand */}
      <Link
        to="/"
        style={{
          textDecoration: "none",
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: "-0.4px",
          color: "#fff",
          whiteSpace: "nowrap",
          marginRight: 8,
        }}
      >
        Find<span style={{ color: "#818cf8" }}>Home</span>
      </Link>

      {/* Public nav — hidden on small screens */}
      <nav
        style={{
          display: "flex",
          gap: 4,
          flex: 1,
        }}
        className="hide-on-mobile"
      >
        <style>{`
          @media (max-width: 768px) { .hide-on-mobile { display: none !important; } }
        `}</style>
        {PUBLIC_LINKS.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            style={{
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              padding: "6px 14px",
              borderRadius: 8,
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94a3b8";
              e.currentTarget.style.background = "transparent";
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>

        {/* Bell */}
        <button
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.07)",
            border: "none",
            borderRadius: 10,
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#94a3b8",
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {/* notification dot */}
          <span style={{
            position: "absolute",
            top: 8,
            right: 9,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#f43f5e",
            border: "2px solid #0f172a",
          }} />
        </button>

        {/* User avatar + dropdown */}
        <div ref={dropRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 10,
              padding: "5px 10px 5px 6px",
              cursor: "pointer",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {/* Avatar circle */}
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>
              {user?.username || "User"}
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="14"
              height="14"
              style={{
                color: "#94a3b8",
                transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {dropOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                minWidth: 180,
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
                overflow: "hidden",
                zIndex: 100,
                animation: "fadeSlideDown 0.15s ease",
              }}
            >
              <style>{`
                @keyframes fadeSlideDown {
                  from { opacity: 0; transform: translateY(-6px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>

              {/* User info row */}
              <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>
                  {user?.username || "User"}
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                  {user?.email || ""}
                </div>
              </div>

              {/* Menu links */}
              {[
                { label: "My Dashboard",  to: "/dashboard/overview" },
                { label: "Profile",        to: "/dashboard/profile" },
                { label: "My Properties", to: "/dashboard/myProperties" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setDropOpen(false)}
                  style={{
                    display: "block",
                    padding: "9px 16px",
                    fontSize: 13,
                    color: "#94a3b8",
                    textDecoration: "none",
                    transition: "background 0.12s, color 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  {item.label}
                </Link>
              ))}

              {/* Divider + Logout */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "6px 0" }}>
                <button
                  onClick={() => { setDropOpen(false); onLogout?.(); }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 16px",
                    fontSize: 13,
                    color: "#f87171",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ─── Logo icon ─────────────────────────────────────────────────── */
const LogoIcon = () => (
  <div className="flex items-center gap-2 px-1">
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
        <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      </svg>
    </div>
    <span
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        fontSize: 17,
        color: "#1e1b4b",
        letterSpacing: "-0.3px",
        whiteSpace: "nowrap",
      }}
    >
      Prop<span style={{ color: "#6366f1" }}>Hive</span>
    </span>
  </div>
);

/* ─── Sidebar ───────────────────────────────────────────────────── */
function Sidebar({ open, setOpen }) {
  const W_OPEN = 220;
  const W_CLOSED = 68;

  return (
    <>
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');`}</style>

      <aside
        style={{
          width: open ? W_OPEN : W_CLOSED,
          minWidth: open ? W_OPEN : W_CLOSED,
          transition: "width 0.25s cubic-bezier(.4,0,.2,1), min-width 0.25s cubic-bezier(.4,0,.2,1)",
          background: "#ffffff",
          borderRight: "1px solid #e8e8f0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
          zIndex: 40,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            padding: open ? "0 18px" : "0 17px",
            borderBottom: "1px solid #e8e8f0",
            overflow: "hidden",
          }}
        >
          {open ? (
            <LogoIcon />
          ) : (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
              </svg>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto", overflowX: "hidden" }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              title={!open ? item.label : undefined}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: open ? "9px 12px" : "9px 0",
                justifyContent: open ? "flex-start" : "center",
                borderRadius: 10,
                marginBottom: 4,
                textDecoration: "none",
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                color: isActive ? "#6366f1" : "#64748b",
                background: isActive
                  ? "linear-gradient(90deg, #ede9fe 0%, #f5f3ff 100%)"
                  : "transparent",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
                overflow: "hidden",
                position: "relative",
              })}
            >
              {({ isActive }) => (
                <>
                  {/* Active left bar */}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "20%",
                        height: "60%",
                        width: 3,
                        borderRadius: "0 3px 3px 0",
                        background: "#6366f1",
                      }}
                    />
                  )}
                  <span
                    style={{
                      color: isActive ? "#6366f1" : "#94a3b8",
                      flexShrink: 0,
                      display: "flex",
                    }}
                  >
                    {item.icon}
                  </span>
                  {open && (
                    <>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && (
                        <span
                          style={{
                            background: "#6366f1",
                            color: "#fff",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "1px 7px",
                            lineHeight: "18px",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {/* collapsed badge dot */}
                  {!open && item.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 10,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#6366f1",
                        border: "2px solid #fff",
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid #e8e8f0" }}>
          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: open ? "8px 12px" : "8px 0",
              justifyContent: open ? "flex-start" : "center",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                width: 18,
                height: 18,
                flexShrink: 0,
                transform: open ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.25s",
              }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {open && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─── Layout ────────────────────────────────────────────────────── */
const UserDashboardLayout = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f8f7ff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Top header ── */}
      <DashboardHeader user={currentUser} onLogout={handleLogout} />

      {/* ── Dashboard body: sidebar + main ── */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Outlet renders the matched child route page */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            overflowX: "auto",
            padding: "28px 28px 40px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
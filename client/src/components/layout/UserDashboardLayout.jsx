// layouts/UserDashboardLayout.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { Navigate, Outlet, NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../navbar/Navbar";
import DashSidebar from "../../pages/dashboard/components/Dashsidebar";
import DashHeader from "../../pages/dashboard/components/DashHeader";

const UserDashboardLayout = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  // Close sidebar on outside click
  useEffect(() => {
    if (!expanded) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [expanded]);

  const handleNavigate = () => setExpanded(false);
  const handleLogout   = () => { logout?.(); navigate("/login"); };

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; font-family: 'DM Sans', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        a { text-decoration: none; }
        @keyframes sidebarIn {
          from { opacity: 0.6; transform: translateX(-10px); }
          to   { opacity: 1;   transform: translateX(0); }
        }
        .sidebar-slide-in { animation: sidebarIn 0.2s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <div className="flex flex-col min-h-screen bg-slate-50">

        {/* ── Top navbar ── */}
        <Navbar />

        {/* ── Dashboard body ── */}
        <div className="flex flex-1 relative overflow-hidden">

          {/* ── Sidebar (fixed, always visible) ── */}
          <DashSidebar
            panelRef={panelRef}
            expanded={expanded}
            setExpanded={setExpanded}
            onNavigate={handleNavigate}
          />

          {/* ── Layout spacer (pushes content 64px right, never overlaps) ── */}
          <div className="flex-shrink-0" style={{ width: 64, minWidth: 64 }} />

          {/* ── Main content ── */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

            {/* Inner topbar */}
            <DashHeader />

            {/* Page content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
              <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-5">
                <Outlet />
              </div>
            </main>

          </div>
        </div>

      </div>
    </>
  );
};

export default UserDashboardLayout;
// layouts/UserDashboardLayout.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../navbar/Navbar";
import DashSidebar from "../../pages/dashboard/pages/Dashsidebar";
import DashHeader from "../../pages/dashboard/pages/DashHeader";

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
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [expanded]);

  const handleNavigate = () => setExpanded(false);
  const handleLogout   = () => { logout?.(); navigate("/login"); };

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans box-border">

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
        <div className="flex-shrink-0 w-16 min-w-[64px]" />

        {/* ── Main content ── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden mt-[65px]">

          {/* Inner topbar */}
          <DashHeader />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-5">
              <Outlet />
            </div>
          </main>

        </div>
      </div>

    </div>
  );
};


export default UserDashboardLayout;
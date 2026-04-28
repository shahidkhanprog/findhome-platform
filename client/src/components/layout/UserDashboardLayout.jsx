// layouts/UserDashboardLayout.jsx
import { useState, useRef, useContext, useEffect } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../navbar/Navbar";
import DashSidebar from "../../pages/dashboard/pages/DashSidebar";
import DashHeader from "../../pages/dashboard/pages/DashHeader";

const UserDashboardLayout = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  // Queries unread count — updated by Queries.jsx via Outlet context
  const [queriesUnread, setQueriesUnread] = useState(0);

  // ─── Dynamic document title ───────────────────────────────────────────────
  useEffect(() => {
    const baseTitle = "FindHome | Dashboard";
    const path = location.pathname;
    let pageTitle = "";

    if (path.startsWith("/dashboard/overview"))        pageTitle = "Overview";
    else if (path.startsWith("/dashboard/myProperties")) pageTitle = "My Properties";
    else if (path.startsWith("/dashboard/addProperty"))  pageTitle = "Add Property";
    else if (path.startsWith("/dashboard/edit/"))        pageTitle = "Edit Property";
    else if (path.startsWith("/dashboard/favorites"))    pageTitle = "Saved Properties";
    else if (path.startsWith("/dashboard/messages"))     pageTitle = "Messages";
    else if (path.startsWith("/dashboard/users"))        pageTitle = "All Users";
    else if (path.startsWith("/dashboard/queries"))      pageTitle = "Contact Queries";
    else if (path.startsWith("/dashboard/property/"))    pageTitle = "Property Details";
    else if (path.startsWith("/dashboard/profile"))      pageTitle = "Profile";
    else                                                 pageTitle = "Dashboard";

    document.title = `${pageTitle} | ${baseTitle}`;
  }, [location.pathname]);

  const handleNavigate = () => setExpanded(false);
  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans box-border">
      <Navbar />

      <div className="flex flex-1 relative overflow-hidden">

        {/* Sidebar — receives both messages (from ChatContext internally) and queries badge */}
        <DashSidebar
          panelRef={panelRef}
          expanded={expanded}
          setExpanded={setExpanded}
          onNavigate={handleNavigate}
          badges={{ queries: queriesUnread }}
        />

        {/* Fixed spacer */}
        <div className="flex-shrink-0 w-16 min-w-[64px]" />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden mt-[65px]">
          <DashHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-5">
              {/* Pass onUnreadChange to Queries.jsx via Outlet context */}
              <Outlet context={{ onUnreadChange: setQueriesUnread }} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
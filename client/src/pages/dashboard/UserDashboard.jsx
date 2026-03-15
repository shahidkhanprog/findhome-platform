import { useState, useEffect } from "react";

/* ── Components ─────────────────────────────────────────────────────────────── */
import Sidebar      from "./components/Sidebar";
import DashHeader   from "./components/DashHeader";
import Overview     from "./components/Overview";
import MyProperties from "./components/MyProperties";
import AddProperty  from "./components/AddProperty";
import SavedPosts   from "./components/SavedPosts";
import Messages     from "./components/Messages";
import Profile      from "./components/Profile";
import DeleteModal  from "./components/DeleteModal";

/* ── Data ───────────────────────────────────────────────────────────────────── */
import { MOCK_USER, MOCK_POSTS } from "./constants";


export default function PropertyDashboard() {
  /* Sidebar: open by default on md+, collapsed on mobile */
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  const [activeNav,     setActiveNav]     = useState("overview");
  const [posts,         setPosts]         = useState(MOCK_POSTS);
  const [user,          setUser]          = useState(MOCK_USER);
  const [editingPost,   setEditingPost]   = useState(null);   // null = "Add" mode
  const [deleteConfirm, setDeleteConfirm] = useState(null);   // holds post id

  /* Auto-collapse sidebar when viewport shrinks below md */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth < 768) setSidebarOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── CRUD handlers ────────────────────────────────────────────────────────── */
  const handleSavePost = form => {
    if (editingPost) {
      setPosts(ps => ps.map(p => p.id === editingPost.id ? { ...p, ...form } : p));
    } else {
      setPosts(ps => [
        ...ps,
        { ...form, id:`p${Date.now()}`, userId:user.id, createdAt:new Date().toISOString(), images:[] },
      ]);
    }
    setEditingPost(null);
    setActiveNav("properties");
  };

  const handleDelete = id => {
    setPosts(ps => ps.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const handleStatusChange = (id, status) =>
    setPosts(ps => ps.map(p => p.id === id ? { ...p, status } : p));

  /* ── Edit shortcut (triggered from MyProperties/PropertyCard) ─────────────── */
  const handleEdit = post => {
    setEditingPost(post);
    setActiveNav("add");      // reuse the AddProperty panel in edit mode
  };

  /* ── Panel router ─────────────────────────────────────────────────────────── */
  const renderPanel = () => {
    // "add" nav item OR editing an existing post both show the form
    if (activeNav === "add") {
      return (
        <AddProperty
          post={editingPost}
          onSave={handleSavePost}
          onCancel={() => { setEditingPost(null); setActiveNav("properties"); }}
        />
      );
    }

    switch (activeNav) {
      case "overview":
        return <Overview posts={posts} user={user} />;

      case "properties":
        return (
          <MyProperties
            posts={posts}
            onEdit={handleEdit}
            onDelete={id => setDeleteConfirm(id)}
            onStatusChange={handleStatusChange}
            onAddNew={() => { setEditingPost(null); setActiveNav("add"); }}
          />
        );

      case "saved":
        return <SavedPosts />;

      case "messages":
        return <Messages />;

      case "profile":
        return <Profile user={user} onSave={setUser} />;

      default:
        return null;
    }
  };

  /* ── Render ───────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* Global styles: Google font + scrollbar-hide utility */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>


      <div
        className="h-screen pt-6 flex flex-col overflow-hidden bg-slate-50"
        style={{ fontFamily:"'DM Sans',sans-serif" }}
      >

        {/*
          ┌──────────────────────────────────────────────────────────┐
            INNER SHELL
            max-w-[1600px] mx-auto  → centred + capped on XL screens
            flex flex-1 min-h-0     → fills remaining height;
                                       min-h-0 is required so flex
                                       children can scroll independently
          └──────────────────────────────────────────────────────────┘
        */}
        <div className="w-full max-w-[1600px] mx-auto flex flex-1 min-h-0">

          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            setEditingPost={setEditingPost}
          />

          {/* Right column: header + scrollable content */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Topbar — h-16, never scrolls */}
            <DashHeader
              activeNav={activeNav}
              editingPost={editingPost}
              user={user}
              setActiveNav={setActiveNav}
            />

            {/*
              Scrollable main area
              flex-1 min-h-0  → fills remaining column height
              overflow-y-auto → vertical scroll (ONLY this element scrolls)
              overflow-x-auto → horizontal scroll for wide content on mobile
            */}
            <main className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
              <div className="px-4 md:px-6 py-5 min-w-[320px]">
                {renderPanel()}
              </div>
            </main>

          </div>{/* end right column */}
        </div>{/* end inner shell */}
      </div>{/* end outer shell */}

      {/* Delete confirmation modal (portal-level, outside the shell) */}
      {deleteConfirm && (
        <DeleteModal
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}
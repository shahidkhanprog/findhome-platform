import { Menu } from "lucide-react";

export default function DashHeader({
  activeNav,
  editingPost,
  user,
  setActiveNav,
  setSidebarOpen,
}) {

  /* Page title based on navigation */
  const getTitle = () => {
    if (editingPost) return "Edit Property";

    switch (activeNav) {
      case "overview":
        return "Dashboard Overview";

      case "properties":
        return "My Properties";

      case "add":
        return "Add Property";

      case "saved":
        return "Saved Posts";

      case "messages":
        return "Messages";

      case "profile":
        return "My Profile";

      default:
        return "Dashboard";
    }
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">

      {/* Left section */}
      <div className="flex items-center gap-3">

        {/* Mobile sidebar button */}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        {/* Page title */}
        <h1 className="text-lg font-semibold text-gray-800">
          {getTitle()}
        </h1>

      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">

        {/* Add property quick button */}
        <button
          onClick={() => setActiveNav("add")}
          className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Add Property
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">

          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <span className="hidden md:block text-sm font-medium text-gray-700">
            {user?.name}
          </span>

        </div>
      </div>
    </header>
  );
}
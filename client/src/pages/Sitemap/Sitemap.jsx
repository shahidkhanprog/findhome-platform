// src/pages/Sitemap.jsx
import { Link } from "react-router-dom";
import {
    MdArrowBack,
    MdMap,
    MdHome,
    MdGridView,
    MdOutlineHome,
    MdAddCircleOutline,
    MdFavoriteBorder,
    MdOutlineMessage,
    MdOutlinePersonOutline,
    MdInbox,
    MdLogin,
    MdAppRegistration,
    MdContactMail,
} from "react-icons/md";

export default function Sitemap() {
    const publicRoutes = [
        { name: "Home", path: "/", icon: MdHome },
        { name: "Login", path: "/login", icon: MdLogin },
        { name: "Register", path: "/register", icon: MdAppRegistration },
        { name: "Contact", path: "/contact", icon: MdContactMail },
        { name: "Privacy Policy", path: "/privacy", icon: MdMap },
        { name: "Terms of Service", path: "/terms", icon: MdMap },
        { name: "Sitemap", path: "/sitemap", icon: MdMap },
    ];

    const dashboardRoutes = [
        { name: "Overview", path: "/dashboard/overview", icon: MdGridView, adminOnly: false },
        { name: "My Properties", path: "/dashboard/myProperties", icon: MdOutlineHome, adminOnly: false },
        { name: "Add Property", path: "/dashboard/addProperty", icon: MdAddCircleOutline, adminOnly: false },
        { name: "Saved Properties", path: "/dashboard/favorites", icon: MdFavoriteBorder, adminOnly: false },
        { name: "Messages", path: "/dashboard/messages", icon: MdOutlineMessage, adminOnly: false },
        { name: "All Users", path: "/dashboard/users", icon: MdOutlinePersonOutline, adminOnly: true },
        { name: "Contact Queries", path: "/dashboard/queries", icon: MdInbox, adminOnly: true },
        { name: "Profile", path: "/dashboard/profile", icon: MdOutlinePersonOutline, adminOnly: false },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-5 transition-colors"
                >
                    <MdArrowBack size={16} /> Back to Home
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-50/80 overflow-hidden">
                    {/* Gradient bar – consistent */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-gray-900" />

                    <div className="p-6 md:p-8">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <MdMap size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-slate-800">Sitemap</h1>
                                <p className="text-xs text-slate-400 mt-0.5">All available pages on FindHome</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Public Routes */}
                            <div>
                                <h2 className="text-[15px] font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-1">
                                    Public Pages
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {publicRoutes.map((route) => (
                                        <Link
                                            key={route.path}
                                            to={route.path}
                                            className="flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors group"
                                        >
                                            <route.icon size={16} className="text-slate-400 group-hover:text-blue-500" />
                                            <span className="text-[13px]">{route.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Dashboard Routes */}
                            <div>
                                <h2 className="text-[15px] font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-1">
                                    Dashboard (Authenticated Users)
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {dashboardRoutes.map((route) => (
                                        <Link
                                            key={route.path}
                                            to={route.path}
                                            className="flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors group"
                                        >
                                            <route.icon size={16} className="text-slate-400 group-hover:text-blue-500" />
                                            <span className="text-[13px]">
                                                {route.name}
                                                {route.adminOnly && (
                                                    <span className="ml-2 text-[9px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full border border-gray-200 align-middle">
                                                        ADMIN
                                                    </span>
                                                )}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Note */}
                            <div className="bg-slate-50 rounded-xl p-4 text-center text-[12px] text-slate-500 border border-slate-100">
                                <p>Some routes require authentication or admin privileges.</p>
                                <p className="text-[11px] mt-1">Public pages are accessible without logging in.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
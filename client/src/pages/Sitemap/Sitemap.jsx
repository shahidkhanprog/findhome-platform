// src/pages/Sitemap.jsx
import { Link } from "react-router-dom";
import {
    MdArrowBack,
    MdMap,
    MdHome,
    MdLogin,
    MdAppRegistration,
    MdContactMail,
    MdInfo,
    MdListAlt,
    MdLockReset,
    MdSearch,
} from "react-icons/md";

export default function Sitemap() {

    const publicRoutes = [
        { name: "Home", path: "/", icon: MdHome },
        { name: "About Us", path: "/about", icon: MdInfo },
        { name: "Contact", path: "/contact", icon: MdContactMail },
        { name: "Browse Properties", path: "/list", icon: MdListAlt },
        { name: "Search Results", path: "/search-results", icon: MdSearch },
        { name: "Login", path: "/login", icon: MdLogin },
        { name: "Register", path: "/register", icon: MdAppRegistration },
        { name: "Forgot Password", path: "/forgotpassword", icon: MdLockReset },
        { name: "Privacy Policy", path: "/privacy-policy", icon: MdMap },
        { name: "Terms of Service", path: "/terms-of-service", icon: MdMap },
        { name: "Sitemap", path: "/sitemap", icon: MdMap },
    ];

    return (
        <div className="bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1224px] mx-auto">

                {/* Back */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-700 mb-5 transition-colors"
                >
                    <MdArrowBack size={16} /> Back to Home
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
                    <div className="h-1.5 bg-gray-700" />

                    <div className="p-6 md:p-8">

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <MdMap size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                                    Sitemap
                                </h1>
                                <p className="text-xs text-slate-400">
                                    All publicly accessible pages on FindHome
                                </p>
                            </div>
                        </div>

                        {/* Routes */}
                        <div>
                            <h2 className="text-[15px] font-semibold text-slate-800 mb-3 border-b pb-1">
                                Public Pages
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {publicRoutes.map((route) => (
                                    <Link
                                        key={route.path}
                                        to={route.path}
                                        className="relative z-10 flex items-center gap-2 p-2 rounded-lg text-slate-600 
                                                   hover:bg-slate-100 hover:text-blue-600 
                                                   transition-all duration-200 
                                                   transform hover:scale-[1.02] 
                                                   cursor-pointer group"
                                    >
                                        <route.icon 
                                            size={16} 
                                            className="text-slate-400 group-hover:text-blue-500 transition-colors" 
                                        />
                                        <span className="text-[13px]">
                                            {route.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Note */}
                        <div className="bg-slate-50 rounded-xl p-4 text-center text-[12px] text-slate-500 border mt-8">
                            <p>Only public pages are listed here.</p>
                            <p>Dashboard pages are protected and not included.</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
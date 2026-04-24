// src/pages/PrivacyPolicy.jsx
import { Link } from "react-router-dom";
import {
    MdArrowBack,
    MdGavel,
    MdEmail,
    MdPhone,
    MdLocationOn,
} from "react-icons/md";

export default function PrivacyPolicy() {
    return (
        <div className="bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1224px] mx-auto">
                {/* Back button – matches dashboard navigation style */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-5 transition-colors"
                >
                    <MdArrowBack size={16} /> Back to Home
                </Link>

                {/* Card – identical to dashboard cards */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-50/80 overflow-hidden">
                    {/* Gradient bar – updated to blue-500 → gray-900 */}
                    <div className="h-1.5 w-full bg-gray-700" />

                    <div className="p-6 md:p-8">
                        {/* Header with icon – like other dash sections */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <MdGavel size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                                    Privacy Policy
                                </h1>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Last updated: April 2025
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 text-slate-600 text-[14px] leading-relaxed">
                            {/* 1. Information we collect */}
                            <div>
                                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                                    1. Information We Collect
                                </h2>
                                <p>When you use FindHome, we may collect:</p>
                                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                                    <li>
                                        Account details: name, email, phone number, profile picture
                                    </li>
                                    <li>
                                        Property information: addresses, prices, descriptions,
                                        photos
                                    </li>
                                    <li>
                                        Communication data: messages sent through our contact forms
                                        or chat
                                    </li>
                                    <li>Usage data: pages visited, searches, saved properties</li>
                                </ul>
                            </div>

                            {/* 2. How we use your information */}
                            <div>
                                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                                    2. How We Use Your Information
                                </h2>
                                <p>We use your data to:</p>
                                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                                    <li>Provide and improve our property listing services</li>
                                    <li>Connect buyers and sellers / tenants and landlords</li>
                                    <li>Send important notifications (e.g., enquiry updates)</li>
                                    <li>Analyze site traffic and enhance user experience</li>
                                    <li>Comply with legal obligations</li>
                                </ul>
                            </div>

                            {/* 3. Sharing your information */}
                            <div>
                                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                                    3. Sharing Your Information
                                </h2>
                                <p>We never sell your personal data. We may share it:</p>
                                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                                    <li>
                                        With other users only as necessary for property transactions
                                    </li>
                                    <li>
                                        With service providers who help operate our platform (cloud
                                        hosting, analytics)
                                    </li>
                                    <li>When required by law or to protect legal rights</li>
                                </ul>
                            </div>

                            {/* 4. Data security */}
                            <div>
                                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                                    4. Data Security
                                </h2>
                                <p>
                                    We implement industry‑standard safeguards (encryption, access
                                    controls, secure servers). However, no internet transmission
                                    is 100% secure. You are responsible for keeping your login
                                    credentials confidential.
                                </p>
                            </div>

                            {/* 5. Your rights */}
                            <div>
                                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                                    5. Your Rights
                                </h2>
                                <p>Depending on your location, you may have the right to:</p>
                                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                                    <li>Access, correct, or delete your personal data</li>
                                    <li>Withdraw consent for marketing communications</li>
                                    <li>Request a copy of your data in a portable format</li>
                                </ul>
                                <p className="mt-1">
                                    To exercise these rights, contact us using the details below.
                                </p>
                            </div>

                            {/* 6. Cookies */}
                            <div>
                                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                                    6. Cookies & Tracking
                                </h2>
                                <p>
                                    We use cookies to remember your preferences, analyze site
                                    usage, and improve performance. You can disable cookies in
                                    your browser settings, but some features may not work as
                                    intended.
                                </p>
                            </div>

                            {/* 7. Changes to this policy */}
                            <div>
                                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                                    7. Changes to This Policy
                                </h2>
                                <p>
                                    We may update this Privacy Policy occasionally. The latest
                                    version will always be posted here with the effective date.
                                    Continued use of the platform constitutes acceptance of any
                                    changes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
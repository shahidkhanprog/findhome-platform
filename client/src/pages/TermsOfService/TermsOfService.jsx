// src/pages/TermsOfService.jsx
import { Link } from "react-router-dom";
import {
  MdArrowBack,
  MdDescription,
  MdEmail,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";

export default function TermsOfService() {
  return (
    <div className="bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1224px] mx-auto">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-5 transition-colors"
        >
          <MdArrowBack size={16} /> Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-50/80 overflow-hidden">
          {/* Gradient bar – matches Privacy Policy */}
          <div className="h-1.5 w-full bg-gray-700" />

          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <MdDescription size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                  Terms of Service
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Effective date: April 2025
                </p>
              </div>
            </div>

            <div className="space-y-6 text-slate-600 text-[14px] leading-relaxed">
              {/* 1. Acceptance of Terms */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or using FindHome ("we", "our", "platform"), you agree to be bound by these Terms of Service. 
                  If you do not agree, please do not use our services.
                </p>
              </div>

              {/* 2. Eligibility */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  2. Eligibility
                </h2>
                <p>
                  You must be at least 18 years old to register an account or list a property. By using the platform, 
                  you represent that you meet this requirement.
                </p>
              </div>

              {/* 3. Account Registration */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  3. Account Registration
                </h2>
                <p>
                  You are responsible for maintaining the confidentiality of your login credentials. 
                  You agree to provide accurate, current, and complete information during registration and to update it as needed.
                </p>
              </div>

              {/* 4. Property Listings */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  4. Property Listings
                </h2>
                <p>
                  Users may list properties for sale or rent. You represent that you have the legal right to list the property 
                  and that all information (price, location, photos) is truthful and not misleading. We reserve the right to 
                  remove any listing that violates these terms.
                </p>
              </div>

              {/* 5. User Conduct */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  5. User Conduct
                </h2>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li>Post false, fraudulent, or misleading content</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Use the platform for any illegal activity</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Scrape or copy data without permission</li>
                </ul>
              </div>

              {/* 6. Intellectual Property */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  6. Intellectual Property
                </h2>
                <p>
                  All content on FindHome (excluding user‑submitted listings) is owned by us and protected by copyright laws. 
                  You may not reproduce, distribute, or create derivative works without our express consent.
                </p>
              </div>

              {/* 7. Third-Party Links */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  7. Third-Party Links
                </h2>
                <p>
                  Our platform may contain links to external websites. We are not responsible for the content or practices 
                  of those sites. Use them at your own risk.
                </p>
              </div>

              {/* 8. Termination */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  8. Termination
                </h2>
                <p>
                  We may suspend or terminate your account if you violate these Terms. You may also delete your account 
                  at any time through your dashboard.
                </p>
              </div>

              {/* 9. Disclaimer of Warranties */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  9. Disclaimer of Warranties
                </h2>
                <p>
                  FindHome is provided "as is" without warranties of any kind. We do not guarantee that property listings 
                  are accurate, that the platform will be uninterrupted, or that defects will be corrected.
                </p>
              </div>

              {/* 10. Limitation of Liability */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  10. Limitation of Liability
                </h2>
                <p>
                  To the fullest extent permitted by law, FindHome shall not be liable for any indirect, incidental, or 
                  consequential damages arising from your use of the platform, including transaction disputes between users.
                </p>
              </div>

              {/* 11. Governing Law */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  11. Governing Law
                </h2>
                <p>
                  These Terms shall be governed by the laws of Pakistan, without regard to its conflict of law provisions.
                </p>
              </div>

              {/* 12. Changes to Terms */}
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 mb-2">
                  12. Changes to These Terms
                </h2>
                <p>
                  We may update these Terms from time to time. The updated version will be posted on this page with a new 
                  effective date. Your continued use constitutes acceptance of the changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
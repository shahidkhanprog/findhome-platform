// src/components/profile/DeactivateSection.jsx
import { useState } from "react";
import { MdPowerSettingsNew, MdWarning, MdExpandMore, MdExpandLess } from "react-icons/md";

const DEACTIVATE_ITEMS = [
  {
    key: "listings",
    text: (
      <>
        Your <strong>property listings will be hidden</strong> from all search
        results
      </>
    ),
  },
  {
    key: "contact",
    text: (
      <>
        Other users <strong>cannot find or contact you</strong>
      </>
    ),
  },
  {
    key: "history",
    text: "Your saved properties and chat history will be paused",
  },
  {
    key: "reactivate",
    text: (
      <>
        You can <strong>reactivate at any time</strong> to restore everything
      </>
    ),
  },
];

export default function DeactivateSection({ isActive, onToggle, loading }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
        isActive ? "bg-white border-amber-100" : "bg-rose-50 border-rose-200"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-4 sm:p-5 gap-3"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isActive ? "bg-amber-50" : "bg-rose-100"
            }`}
          >
            <MdPowerSettingsNew
              size={16}
              className={isActive ? "text-amber-500" : "text-rose-500"}
            />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[13px] font-bold text-slate-700 truncate">
              {isActive ? "Deactivate Account" : "Account Deactivated"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {isActive
                ? "Temporarily hide your profile & listings"
                : "Your account is currently inactive"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`hidden xs:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full border ${
              isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-rose-100 text-rose-600 border-rose-200"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
          {expanded ? (
            <MdExpandLess size={18} className="text-slate-400" />
          ) : (
            <MdExpandMore size={18} className="text-slate-400" />
          )}
        </div>
      </button>

      <div className="xs:hidden px-4 pb-2 flex">
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-rose-100 text-rose-600 border-rose-200"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {(expanded || !isActive) && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <div
            className={`rounded-xl p-4 border ${
              isActive
                ? "bg-amber-50 border-amber-200"
                : "bg-rose-100 border-rose-200"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <MdWarning
                size={16}
                className={`flex-shrink-0 mt-0.5 ${
                  isActive ? "text-amber-500" : "text-rose-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[12px] font-bold mb-2 ${
                    isActive ? "text-amber-700" : "text-rose-700"
                  }`}
                >
                  {isActive
                    ? "What happens when you deactivate?"
                    : "Your account is currently deactivated"}
                </p>
                <ul
                  className={`text-[11px] space-y-1.5 list-disc list-inside ${
                    isActive ? "text-amber-600" : "text-rose-600"
                  }`}
                >
                  {DEACTIVATE_ITEMS.map((item) => (
                    <li key={item.key}>{item.text}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggle}
              disabled={loading}
              className={`mt-4 w-full py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60
                ${
                  isActive
                    ? "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white"
                }`}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <MdPowerSettingsNew size={14} />
              )}
              {loading
                ? "Please wait…"
                : isActive
                  ? "Yes, Deactivate My Account"
                  : "Reactivate My Account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
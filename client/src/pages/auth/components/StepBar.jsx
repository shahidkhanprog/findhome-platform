import React from "react";
import { MdCheckCircle } from "react-icons/md";

const STEPS = ["Email", "OTP", "New Password"];

/**
 * StepBar
 * -------
 * Visual step indicator for the ForgotPassword multi-step flow.
 *
 * Props:
 *   current {number} - index of the active step (0, 1, or 2)
 */
const StepBar = ({ current }) => {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 transition-all duration-300",
                  done
                    ? "bg-violet-600 border-violet-600 text-white"
                    : active
                    ? "bg-white border-violet-600 text-violet-600"
                    : "bg-white border-slate-200 text-slate-400",
                ].join(" ")}
              >
                {done ? <MdCheckCircle size={16} /> : i + 1}
              </div>
              <span
                className={[
                  "text-[10px] font-semibold uppercase tracking-wide",
                  active
                    ? "text-violet-600"
                    : done
                    ? "text-violet-400"
                    : "text-slate-400",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "h-[2px] w-10 sm:w-14 mb-5 mx-1 rounded-full transition-all duration-500",
                  i < current ? "bg-violet-600" : "bg-slate-200",
                ].join(" ")}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepBar;

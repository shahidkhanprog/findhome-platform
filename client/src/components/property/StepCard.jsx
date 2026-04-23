import { STEPS, S_BG, S_ACCENT, S_PAL, STEP_ICONS } from "../../constants/addPropertyConstants.jsx";

export default function StepCard({ stepIndex, children }) {
  const p = S_PAL[stepIndex];
  const Icon = STEP_ICONS[stepIndex];
  return (
    <div className={`relative ${S_BG[stepIndex]} border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm`}>
      <div className={`absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full ${S_ACCENT[stepIndex]}`} />
      <div className="pl-5 pr-4 sm:pr-6 py-4 sm:py-5">
        <div className="flex items-start gap-3 mb-5">
          <div className={`relative shrink-0 w-10 h-10 rounded-xl ${p.icon} ring-1 ${p.ring} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
            <span className={`absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full ${p.num} text-white text-[9px] font-bold flex items-center justify-center ring-[1.5px] ring-white`}>
              {stepIndex + 1}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 leading-tight">{STEPS[stepIndex].label}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{STEPS[stepIndex].desc}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
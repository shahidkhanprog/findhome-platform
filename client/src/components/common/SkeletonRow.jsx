export default function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 md:px-5 py-3.5 border-b border-slate-50 animate-pulse min-w-0">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="h-3 bg-slate-100 rounded w-2/3" />
        <div className="h-2.5 bg-slate-100 rounded w-1/3" />
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <div className="w-20 h-5 bg-slate-100 rounded-full" />
        <div className="w-16 h-5 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}
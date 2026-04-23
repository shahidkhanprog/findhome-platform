export default function SavedSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="h-44 bg-slate-100" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-slate-100 rounded-lg w-24" />
        <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-100 rounded-lg w-1/3" />
        <div className="flex gap-3">
          <div className="h-3 bg-slate-100 rounded-lg w-16" />
          <div className="h-3 bg-slate-100 rounded-lg w-12" />
        </div>
        <div className="h-5 bg-slate-100 rounded-lg w-1/2 mt-2" />
      </div>
      <div className="mx-4 border-t border-slate-100" />
      <div className="p-3 flex gap-2">
        <div className="flex-1 h-9 bg-slate-100 rounded-xl" />
        <div className="w-24 h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}
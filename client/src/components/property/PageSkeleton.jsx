// src/components/property/PageSkeleton.jsx
export default function PageSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto pb-10 animate-pulse">
      <div className="mb-5 px-1">
        <div className="h-7 bg-slate-100 rounded-xl w-48 mb-2" />
        <div className="h-3 bg-slate-100 rounded-lg w-72" />
      </div>
      <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-3 mb-6 gap-2">
        {[1, 2, 3, 4].map(i => <div key={i} className="flex-1 h-9 bg-slate-100 rounded-xl" />)}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 rounded-xl" />
          <div><div className="h-4 bg-slate-100 rounded-lg w-24 mb-1.5" /><div className="h-3 bg-slate-100 rounded-lg w-36" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={i <= 2 ? "col-span-2" : ""}>
              <div className="h-3 bg-slate-100 rounded w-20 mb-1.5" />
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <div className="w-24 h-10 bg-slate-100 rounded-xl" />
        <div className="flex-1 flex items-center justify-center gap-1.5">
          {[1,2,3,4].map(i => <div key={i} className="h-1.5 w-4 bg-slate-100 rounded-full" />)}
        </div>
        <div className="w-28 h-10 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}
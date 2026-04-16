// // src/components/list/Pagination.jsx

// const Pagination = ({ page, totalPages, onPageChange }) => {
//   if (totalPages <= 1) return null;

//   const getPages = () => {
//     if (totalPages <= 5)
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     if (page <= 3)
//       return [1, 2, 3, 4, "...", totalPages];
//     if (page >= totalPages - 2)
//       return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
//     return [1, "...", page - 1, page, page + 1, "...", totalPages];
//   };

//   return (
//     <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-4 pb-16 flex-wrap">

//       {/* Prev */}
//       <button
//         onClick={() => onPageChange(page - 1)}
//         disabled={page === 1}
//         className="px-3 sm:px-4 h-10 rounded-xl font-bold text-sm border border-slate-100 bg-white text-slate-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//       >
//         ← Prev
//       </button>

//       {/* Page numbers */}
//       {getPages().map((n, i) =>
//         n === "..." ? (
//           <span
//             key={`ellipsis-${i}`}
//             className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm"
//           >
//             ...
//           </span>
//         ) : (
//           <button
//             key={n}
//             onClick={() => onPageChange(n)}
//             className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
//               page === n
//                 ? "bg-[#f36c3a] text-white shadow-md shadow-orange-200"
//                 : "bg-white text-slate-500 border border-slate-100 hover:bg-orange-50"
//             }`}
//           >
//             {n}
//           </button>
//         )
//       )}

//       {/* Next */}
//       <button
//         onClick={() => onPageChange(page + 1)}
//         disabled={page === totalPages}
//         className="px-3 sm:px-4 h-10 rounded-xl font-bold text-sm border border-slate-100 bg-white text-slate-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//       >
//         Next →
//       </button>
//     </div>
//   );
// };

// export default Pagination;

// src/components/list/Pagination.jsx
const Pagination = ({ page, totalPages, onPageChange }) => {
  // For single page, show disabled buttons + page indicator
  if (totalPages === 1) {
    return (
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-4 pb-16 flex-wrap">
        <button
          disabled
          className="px-3 sm:px-4 h-10 rounded-xl font-bold text-sm border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed transition-all"
        >
          ← Prev
        </button>
        <button
          className="w-10 h-10 rounded-xl font-bold text-sm bg-[#f36c3a] text-white shadow-md shadow-orange-200"
        >
          1
        </button>
        <button
          disabled
          className="px-3 sm:px-4 h-10 rounded-xl font-bold text-sm border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>
    );
  }

  // For multiple pages, use your existing logic
  const getPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3)
      return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-4 pb-16 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 sm:px-4 h-10 rounded-xl font-bold text-sm border border-slate-100 bg-white text-slate-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ← Prev
      </button>

      {getPages().map((n, i) =>
        n === "..." ? (
          <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm">
            ...
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
              page === n
                ? "bg-[#f36c3a] text-white shadow-md shadow-orange-200"
                : "bg-white text-slate-500 border border-slate-100 hover:bg-orange-50"
            }`}
          >
            {n}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 sm:px-4 h-10 rounded-xl font-bold text-sm border border-slate-100 bg-white text-slate-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;

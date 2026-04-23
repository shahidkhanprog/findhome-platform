import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { PAGE_SIZE_OPTIONS } from "../../constants/dashboardConstants";

export default function PaginationBar({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalItems,
}) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-2.5 bg-white border border-slate-200 rounded-2xl px-3 py-3 mt-2 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:gap-3">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <p className="text-[12px] sm:text-sm text-slate-600 whitespace-nowrap leading-none">
          Showing <span className="font-semibold text-slate-900">{startItem}</span>
          <span className="mx-1 text-slate-400">–</span>
          <span className="font-semibold text-slate-900">{endItem}</span>{" "}
          <span className="text-slate-400 text-[10px] uppercase tracking-wider">of</span>{" "}
          <span className="font-semibold text-slate-900">{totalItems}</span>
        </p>
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <label htmlFor="page-size" className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-tight whitespace-nowrap select-none">
            <span className="sm:hidden">Per page</span>
            <span className="hidden sm:inline">Items per page</span>
          </label>
          <div className="relative">
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-[12px] sm:text-sm rounded-lg focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 pl-2.5 pr-6 py-1.5 transition-all cursor-pointer hover:border-slate-300"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1 sm:justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-0.5 sm:gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <MdChevronLeft size={16} />
          <span className="hidden sm:inline">Prev</span>
        </button>
        <div className="flex items-center gap-1 mx-1">
          {pageNumbers[0] > 1 && (
            <>
              <button onClick={() => onPageChange(1)} className="w-8 h-8 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">1</button>
              {pageNumbers[0] > 2 && <span className="text-slate-400 text-[12px] px-0.5">…</span>}
            </>
          )}
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`w-8 h-8 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
                num === currentPage
                  ? "bg-gray-600 text-white border-transparent shadow-sm shadow-gray-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-gray-300 hover:text-gray-600"
              }`}
            >
              {num}
            </button>
          ))}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="text-slate-400 text-[12px] px-0.5">…</span>}
              <button onClick={() => onPageChange(totalPages)} className="w-8 h-8 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">{totalPages}</button>
            </>
          )}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-0.5 sm:gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <MdChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
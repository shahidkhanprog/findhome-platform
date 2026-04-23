import { MdInbox } from "react-icons/md";
import TableSkeletonRow from "../common/TableSkeletonRow";
import QueryTableRow from "./QueryTableRow";

export default function QueryTable({ loading, paginated, safePage, pageSize, onReadMore, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-50/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px]">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-100">
              {["S.No", "Full Name", "Subject", "Status", "Sent At", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => <TableSkeletonRow key={i} columns={6} />)
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                      <MdInbox size={22} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-400">No queries found</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((msg, i) => {
                const globalIndex = (safePage - 1) * pageSize + i + 1;
                return (
                  <QueryTableRow
                    key={msg.id}
                    message={msg}
                    index={globalIndex}
                    onReadMore={onReadMore}
                    onDelete={onDelete}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
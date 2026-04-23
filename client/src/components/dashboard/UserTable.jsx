import TableSkeletonRow from "../common/TableSkeletonRow";
import UserTableRow from "./UserTableRow";

export default function UserTable({ loading, paginated, safePage, pageSize, currentUser, onEdit, onToggle, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-100">
              {["#", "User", "Properties", "Email", "Role", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? [1, 2, 3, 4, 5].map(i => <TableSkeletonRow key={i} columns={7} />)
              : paginated.length === 0
                ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                          <MdPerson size={22} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">No users found</p>
                      </div>
                    </td>
                  </tr>
                )
                : paginated.map((u, i) => {
                    const globalIndex = (safePage - 1) * pageSize + i + 1;
                    const isSelf = u.id === currentUser?.id;
                    return (
                      <UserTableRow
                        key={u.id}
                        user={u}
                        index={globalIndex}
                        isSelf={isSelf}
                        onEdit={onEdit}
                        onToggle={onToggle}
                        onDelete={onDelete}
                      />
                    );
                  })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
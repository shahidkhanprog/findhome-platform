export default function TableSkeletonRow({ columns = 7 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3 bg-slate-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}
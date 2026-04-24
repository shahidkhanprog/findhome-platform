import StatCard from "../common/StatCard";

export default function StatsGrid({ stats, loading, showingAll }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} loading={loading} isAdminView={showingAll} />
      ))}
    </div>
  );
}
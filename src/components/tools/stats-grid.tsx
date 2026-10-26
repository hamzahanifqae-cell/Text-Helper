export function StatsGrid({ stats }: { stats: Array<{ label: string; value: string | number }> }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{stats.map(stat => (
    <div key={stat.label} className="stat-cell"><div className="stat-value tabular-nums">{stat.value}</div><div className="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.label}</div></div>
  ))}</div>;
}

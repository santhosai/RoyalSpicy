interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-accent rounded-xl p-3 text-center">
      <div className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-extrabold text-accent font-display leading-tight">{value}</div>
    </div>
  );
}

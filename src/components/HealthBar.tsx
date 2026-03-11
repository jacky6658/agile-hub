interface HealthBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

export default function HealthBar({ label, value, maxValue = 100, color }: HealthBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const barColor = color || (percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500');

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs sm:text-sm text-slate-600 w-28 sm:w-40 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-sm font-medium w-12 text-right ${percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
        {value}%
      </span>
    </div>
  );
}

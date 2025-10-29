import { BoxIcon } from 'lucide-react';
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: BoxIcon;
  gradient: string;
}
export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  gradient
}: MetricCardProps) {
  return <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {change}
          </span>}
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>;
}
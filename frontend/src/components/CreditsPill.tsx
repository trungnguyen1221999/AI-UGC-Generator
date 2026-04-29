import { Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreditsPill({ credits }: { credits: number | null }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-[10px] uppercase tracking-wider font-bold">Credits</span>
        <Zap className="w-4 h-4 text-violet-400 fill-white" />
      </div>
      <div className="text-2xl font-black mb-2">{credits ?? "0"}</div>
      <div className="w-full bg-white/5 rounded-full h-1.5 mb-3">
        <div
          className="bg-violet-500 h-1.5 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(100, ((credits ?? 0) / 100) * 100)}%` }}
        />
      </div>
      <Link to="/dashboard/plan" className="text-violet-400 text-xs font-bold hover:text-white transition flex items-center gap-1">
        Upgrade <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

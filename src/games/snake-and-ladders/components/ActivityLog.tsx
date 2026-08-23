'use client';

import React from 'react';
import { ScrollText } from 'lucide-react';

interface ActivityLogProps {
  logs: string[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  return (
    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
      <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
        <ScrollText className="w-3.5 h-3.5 text-orange-400" />
        <span>Match Activity</span>
      </div>

      <div className="space-y-1.5 text-xs text-slate-300 max-h-32 overflow-y-auto pr-1">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-xl text-[11px] font-medium leading-tight border transition-colors ${
              idx === 0
                ? 'bg-slate-800/90 text-white border-amber-500/30'
                : 'bg-slate-900/40 text-slate-400 border-transparent'
            }`}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

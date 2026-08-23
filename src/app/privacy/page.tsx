import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-10 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Data Promise</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          CATI KHELGHAR is 100% offline and stores nothing on external servers.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
        <div className="flex items-center gap-3 text-white font-bold text-base">
          <Lock className="w-5 h-5 text-emerald-400" />
          <span>No Accounts, No Tracking, No Analytics</span>
        </div>
        <p>
          CATI KHELGHAR is engineered from the ground up as a purely client-side progressive web application. When you play games on CATI KHELGHAR:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-400">
          <li>No personal data is collected or sent to any remote server.</li>
          <li>All player names, sound preferences, and high scores are saved strictly in your device’s local browser storage (`localStorage`).</li>
          <li>We use no third-party tracking scripts, cookies, or targeted advertising trackers.</li>
        </ul>
        <p>
          You can reset or wipe all locally stored scores and player names at any time by clicking the &ldquo;Reset Local Data&rdquo; button in the footer.
        </p>
      </div>
    </div>
  );
}

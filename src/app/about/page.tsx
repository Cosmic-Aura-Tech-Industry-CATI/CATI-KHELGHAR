import React from 'react';
import { Heart, Sparkles, Smartphone, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-12 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About CATI KHELGHAR
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Reconnecting families and friends through simple, joyful, offline casual tabletop games on a single screen.
        </p>
      </div>

      {/* Story */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 leading-relaxed text-sm text-slate-300">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" />
          <span>Why We Built CATI KHELGHAR</span>
        </h2>
        <p>
          In a world dominated by matchmaking queues, subscriptions, microtransactions, and constant internet requirements, we missed the timeless joy of sitting around a table with siblings, parents, cousins, or friends and rolling a physical dice.
        </p>
        <p>
          <strong>CATI KHELGHAR was created to bring back that magic.</strong> No login screen, no Discord invites, no ping lag, no accounts. Just open the website on your phone, tablet, or laptop, pick a game, and pass the device around.
        </p>
      </div>

      {/* 3 Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Instant Accessibility</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero load time, zero installation, zero authentication barriers. Anyone can play in under 5 seconds.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">One Device for All</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Engineered exclusively for pass-and-play. Hand the phone to the next player when your turn is up.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">100% Privacy Friendly</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We collect zero personal data, zero cookies, zero analytics. What you play stays on your device.
          </p>
        </div>
      </div>
    </div>
  );
}

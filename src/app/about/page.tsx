import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Heart, Sparkles, Smartphone, ShieldCheck, Zap, Crown, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About CATI KHELGHAR | Offline Family Gaming by DIMISI',
  description:
    'The story and mission of CATI KHELGHAR. Founded by Shikhar Dixit under DIMISI Technologies Pvt Ltd to bring back face-to-face casual tabletop play on one screen.',
  alternates: {
    canonical: 'https://cati47.tech/about',
  },
};

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
          In a world dominated by matchmaking queues, subscriptions, microtransactions, and constant internet requirements,
          we missed the timeless joy of sitting around a table with siblings, parents, cousins, or friends and rolling a physical dice.
        </p>
        <p>
          <strong>CATI KHELGHAR was created to bring back that magic.</strong> No login screen, no Discord invites, no ping lag, no accounts.
          Just open the website on your phone, tablet, or laptop, pick a game, and pass the device around.
        </p>
        <p>
          The platform was conceived and architected by{' '}
          <Link href="/team/shikhar-dixit" className="text-orange-400 hover:text-orange-300 font-bold underline underline-offset-2">
            Shikhar Dixit
          </Link>
          , Founder and CEO of{' '}
          <Link href="/team" className="text-white hover:text-orange-400 font-bold underline underline-offset-2">
            DIMISI Technologies Pvt Ltd
          </Link>
          , originating from the early Cosmic Aura Tech Industry (CATI) initiative to champion offline-first accessibility.
        </p>
      </div>

      {/* Leadership Attribution Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-orange-500/30 flex-shrink-0 bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/team/shikhar-dixit.png"
            alt="Shikhar Dixit - Founder & CEO of DIMISI Technologies"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Crown className="w-3 h-3" />
            <span>Lead Architect &amp; Developer</span>
          </div>
          <h3 className="text-lg font-black text-white">Shikhar Dixit</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Founder &amp; CEO of DIMISI Technologies Pvt Ltd. Dedicated to crafting friction-free digital experiences with sub-second execution and zero data harvesting.
          </p>
          <div className="pt-1">
            <Link
              href="/team/shikhar-dixit"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 underline underline-offset-2"
            >
              Read full executive profile &rarr;
            </Link>
          </div>
        </div>
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

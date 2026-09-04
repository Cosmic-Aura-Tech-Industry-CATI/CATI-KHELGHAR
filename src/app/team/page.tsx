import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Crown, Server, TrendingUp, Globe, ArrowRight, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Founding Team & Leadership — DIMISI Technologies | CATI KHELGHAR',
  description:
    'Meet the founding leadership team behind DIMISI Technologies Pvt Ltd and CATI KHELGHAR: Shikhar Dixit (Founder & CEO), Nishkarsh Mishra (Co-Founder, COO & CMO), and Swatantra Singh (Co-Founder & CTO).',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://cati47.tech/#dimisi-technologies',
  name: 'DIMISI Technologies Pvt Ltd',
  alternateName: ['DIMISI Technologies', 'DIMISI'],
  url: 'https://cati47.tech/',
  description: 'Parent organization behind CATI KHELGHAR, Kalesh, and DIMISIPEDIA.',
  member: [
    {
      '@type': 'Person',
      name: 'Shikhar Dixit',
      jobTitle: 'Founder & CEO',
      url: 'https://cati47.tech/team/shikhar-dixit',
    },
    {
      '@type': 'Person',
      name: 'Nishkarsh Mishra',
      jobTitle: 'Co-Founder, COO & CMO',
      url: 'https://cati47.tech/team/nishkarsh-mishra',
    },
    {
      '@type': 'Person',
      name: 'Swatantra Singh',
      jobTitle: 'Co-Founder & CTO',
      url: 'https://cati47.tech/team/swatantra-singh',
    },
  ],
};

const leaders = [
  {
    name: 'Shikhar Dixit',
    slug: 'shikhar-dixit',
    role: 'Founder & CEO',
    org: 'DIMISI Technologies',
    secondaryRole: 'Developer — CATI KHELGHAR',
    image: '/team/shikhar-dixit.png',
    rank: '#1',
    rankColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    icon: Crown,
    summary:
      'Directs overall product architecture, technical vision, and strategic direction across DIMISI Technologies. Primary architect and developer behind CATI KHELGHAR.',
    tags: ['Product Architecture', 'Full-Stack Dev', 'Game Engine', 'Offline-First Systems', 'UI/UX'],
  },
  {
    name: 'Nishkarsh Mishra',
    slug: 'nishkarsh-mishra',
    role: 'Co-Founder, Director, COO & CMO',
    org: 'DIMISI Technologies',
    secondaryRole: 'Operations & Growth Lead',
    image: '/team/nishkarsh-mishra.png',
    rank: '#2',
    rankColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: TrendingUp,
    summary:
      'Heads corporate operations, marketing strategy, strategic partnerships, and community growth. Championed product presence at major entrepreneurship forums including IIT Bombay E-Summit.',
    tags: ['Operations Strategy', 'Marketing & Growth', 'Brand Leadership', 'User Acquisition', 'Partnerships'],
  },
  {
    name: 'Swatantra Singh',
    slug: 'swatantra-singh',
    role: 'Co-Founder, Director & CTO',
    org: 'DIMISI Technologies',
    secondaryRole: 'Platform Architecture & Systems Engineering',
    image: '/team/swatantra-singh.png',
    rank: '#3',
    rankColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    icon: Server,
    summary:
      'Oversees systems infrastructure, technical scalability, and core platform engineering. Co-architected company projects starting with early AI and face recognition systems.',
    tags: ['Systems Engineering', 'Platform Scalability', 'Infrastructure', 'Cloud Architecture', 'Core Engineering'],
  },
];

export default function TeamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="py-12 px-4 sm:px-6 max-w-5xl mx-auto space-y-16 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>DIMISI Technologies Leadership</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Meet the Founding Team
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            The leadership team behind DIMISI Technologies Pvt Ltd and CATI KHELGHAR, documented according to official
            records on Dimisipedia.
          </p>
        </div>

        {/* Founding Trio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaders.map((leader) => {
            const Icon = leader.icon;
            return (
              <div
                key={leader.slug}
                className="relative group rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 shadow-xl"
              >
                <div className="space-y-5">
                  {/* Photo & Badge */}
                  <div className="relative flex items-center justify-between">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-slate-800 group-hover:ring-slate-700 transition-all">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border ${leader.rankColor}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{leader.rank}</span>
                    </span>
                  </div>

                  {/* Names & Designations */}
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                      {leader.name}
                    </h2>
                    <div className="text-xs font-bold text-slate-300">{leader.role}</div>
                    <div className="text-[11px] font-semibold text-slate-400">{leader.secondaryRole}</div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-300 leading-relaxed">{leader.summary}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {leader.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Profile Link Button */}
                <div className="pt-6 mt-4 border-t border-slate-800/80">
                  <Link
                    href={`/team/${leader.slug}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <span>View Full Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate Heritage Section */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">About DIMISI Technologies Pvt Ltd</h3>
              <p className="text-xs text-slate-400">
                CIN: U62013UP2026PTC246506 • Registered in Kanpur, Uttar Pradesh
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            DIMISI Technologies is an Indian technology enterprise founded by <strong>Shikhar Dixit</strong>,{' '}
            <strong>Nishkarsh Mishra</strong>, and <strong>Swatantra Singh</strong>. The company name is an acronym
            derived from the founders&apos; surnames: <strong>DI</strong> (Dixit) + <strong>MI</strong> (Mishra) +{' '}
            <strong>SI</strong> (Singh). Originating from the Cosmic Aura Tech Industry (CATI) initiative started in
            October 2024 at Axis College, the company creates high-utility, zero-bloat, privacy-focused software platforms
            including CATI KHELGHAR, Kalesh, and DIMISIPEDIA.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="https://dimisi.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>dimisi.tech</span>
            </a>
            <a
              href="https://dimisipedia.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>dimisipedia.me</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

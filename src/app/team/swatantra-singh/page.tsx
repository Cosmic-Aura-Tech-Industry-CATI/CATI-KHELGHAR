import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Server, ShieldCheck, Globe, Building2, ChevronRight, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Swatantra Singh – Co-Founder & CTO of DIMISI Technologies',
  description:
    'Profile of Swatantra Singh, Co-Founder, Director, and Chief Technology Officer (CTO) of DIMISI Technologies Pvt Ltd, leading platform architecture, systems engineering, and infrastructure scalability.',
  openGraph: {
    title: 'Swatantra Singh – Co-Founder & CTO of DIMISI Technologies',
    description:
      'Profile of Swatantra Singh, Co-Founder, Director, and CTO of DIMISI Technologies Pvt Ltd.',
    type: 'profile',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://cati47.tech/#swatantra-singh',
      name: 'Swatantra Singh',
      jobTitle: 'Co-Founder & Chief Technology Officer (CTO)',
      worksFor: { '@id': 'https://cati47.tech/#dimisi-technologies' },
      url: 'https://cati47.tech/team/swatantra-singh',
      image: 'https://cati47.tech/team/swatantra-singh.png',
      description:
        'Co-Founder, Director, and Chief Technology Officer (CTO) of DIMISI Technologies Pvt Ltd, leading platform architecture and technical scalability.',
      knowsAbout: [
        'Platform Architecture',
        'Systems Engineering',
        'Cloud Infrastructure',
        'High-Concurrence Web Systems',
        'Computer Vision & AI Systems',
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://cati47.tech/#dimisi-technologies',
      name: 'DIMISI Technologies Pvt Ltd',
      alternateName: ['DIMISI Technologies', 'DIMISI'],
      url: 'https://cati47.tech/',
      founder: { '@id': 'https://cati47.tech/#swatantra-singh' },
      description: 'Software product and technology enterprise based in Kanpur, Uttar Pradesh.',
    },
  ],
};

const pillars = [
  {
    icon: '⚙️',
    title: 'High-Concurrence Architecture',
    desc: 'Designs scalable distributed backend systems that manage seamless interactions without performance degradation.',
  },
  {
    icon: '🛡️',
    title: 'Reliability & Fault Tolerance',
    desc: 'Engineers fault-tolerant infrastructure ensuring 99.9% uptime and zero-data-loss execution across product ecosystems.',
  },
  {
    icon: '🚀',
    title: 'Low-Latency Systems',
    desc: 'Optimizes runtime execution and network payloads to deliver ultra-responsive client responses across devices.',
  },
  {
    icon: '🔍',
    title: 'Platform Scalability',
    desc: 'Orchestrates infrastructure capacity and deployment pipelines to scale seamlessly from thousands to millions of users.',
  },
];

const techTable = [
  { label: 'Principal Entity', value: 'Swatantra Singh' },
  { label: 'Corporate Roles', value: 'Co-Founder, Director, Chief Technology Officer (CTO)' },
  { label: 'Parent Organization', value: 'DIMISI Technologies Pvt Ltd' },
  { label: 'CIN Registration', value: 'U62013UP2026PTC246506 (Ministry of Corporate Affairs, India)' },
  { label: 'Key Projects', value: 'Kalesh Architecture, DIMISIPEDIA Systems, CATI Systems Infrastructure' },
  { label: 'Acronym Origin', value: 'Represents the "SI" (Singh) in DIMISI (DI-MI-SI)' },
  { label: 'Engineering Focus', value: 'Distributed Systems, Platform Scalability, Infrastructure, Cloud Architecture' },
];

const faqs = [
  {
    q: 'Who is Swatantra Singh?',
    a: 'Swatantra Singh is an Indian technology executive and software engineer. He is a Co-Founder, Director, and the Chief Technology Officer (CTO) of DIMISI Technologies Private Limited.',
  },
  {
    q: 'What is Swatantra Singh\'s role at DIMISI Technologies?',
    a: 'As Chief Technology Officer, Swatantra Singh oversees platform architecture, systems engineering, technical scalability, and infrastructure across DIMISI Technologies products, including Kalesh and DIMISIPEDIA.',
  },
  {
    q: 'How did Swatantra Singh join DIMISI Technologies?',
    a: 'His entrepreneurial journey began in October 2024 at Axis College, Kanpur, where he collaborated with Shikhar Dixit to build a Face Recognition System. This partnership became the foundation of CATI (Cosmic Aura Tech Industry) and subsequently DIMISI Technologies.',
  },
  {
    q: 'What does "DIMISI" stand for?',
    a: 'According to Dimisipedia, "DIMISI" is an acronym honoring the three founders: DI (Dixit), MI (Mishra), and SI (Singh - representing Swatantra Singh).',
  },
];

export default function SwatantraSinghPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-14 animate-fadeIn">
        {/* Back Link */}
        <Link
          href="/team"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Leadership</span>
        </Link>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-12 shadow-2xl">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start gap-8">
            {/* Photo */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-sky-500/30 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/team/swatantra-singh.png"
                  alt="Swatantra Singh"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Server className="w-2.5 h-2.5" />
                <span>#3 Co-Founder &amp; CTO</span>
              </span>
            </div>

            {/* Identity */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
                  <Server className="w-3.5 h-3.5" />
                  <span>Technical Leadership</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Swatantra Singh</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Server className="w-3 h-3" />
                    <span>Co-Founder, Director &amp; CTO &middot; DIMISI Technologies</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Platform Architect</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                <strong className="text-white">Swatantra Singh</strong> is a{' '}
                <strong className="text-white">Co-Founder, Director, and Chief Technology Officer (CTO)</strong> of{' '}
                <strong className="text-white">DIMISI Technologies Private Limited</strong>. He spearheads platform
                architecture, systems engineering, infrastructure reliability, and technical scalability across the
                company&apos;s product portfolio.
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  'Platform Architecture',
                  'Systems Engineering',
                  'Cloud Infrastructure',
                  'Database Scalability',
                  'Distributed Systems',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://dimisi.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>dimisi.tech</span>
                </a>
                <a
                  href="https://dimisipedia.me/wiki/Swatantra_Singh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>Dimisipedia Record</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Founding Story & Technical Journey */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-black text-white">Genesis &amp; Systems Leadership</h2>
          </div>
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              Swatantra Singh&apos;s partnership with Shikhar Dixit originated on{' '}
              <strong className="text-white">October 15, 2024</strong> at Axis College, Kanpur, where they jointly
              developed an intelligent Face Recognition System. This technical collaboration sparked the creation of
              Cosmic Aura Tech Industry (CATI), which subsequently evolved into{' '}
              <strong className="text-white">DIMISI Technologies Private Limited</strong> (incorporated on April 9, 2026;
              CIN: U62013UP2026PTC246506).
            </p>
            <p>
              As CTO, Singh oversees engineering standards, backend scalability, and cloud architecture across DIMISI&apos;s
              flagship projects:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>
                <strong className="text-white">Kalesh:</strong> High-traffic anonymous social polling and engagement platform.
              </li>
              <li>
                <strong className="text-white">DIMISIPEDIA:</strong> Public institutional knowledge base and documentation system.
              </li>
              <li>
                <strong className="text-white">CATI KHELGHAR:</strong> Supporting infrastructure and delivery pipeline for offline-first casual gaming.
              </li>
            </ul>
          </div>
        </div>

        {/* Architectural Pillars */}
        <div className="space-y-5">
          <h2 className="text-xl font-black text-white">Engineering Pillars &amp; Standards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p) => (
              <div key={p.title} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl select-none">{p.icon}</span>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Table */}
        <div className="space-y-5">
          <h2 className="text-xl font-black text-white">Corporate &amp; Technical Profile</h2>
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-xs">
              <tbody>
                {techTable.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-slate-900/80' : 'bg-slate-900/40'}>
                    <td className="px-5 py-3 font-bold text-slate-300 w-2/5 border-r border-slate-800">{row.label}</td>
                    <td className="px-5 py-3 text-slate-200">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-5">
          <h2 className="text-xl font-black text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

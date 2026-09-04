import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, Award, Globe, Building2, ChevronRight, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nishkarsh Mishra – Co-Founder, COO & CMO of DIMISI Technologies',
  description:
    'Profile of Nishkarsh Mishra, Co-Founder, Director, Chief Operating Officer (COO), and Chief Marketing Officer (CMO) of DIMISI Technologies Pvt Ltd, leading operations, marketing strategy, and brand growth.',
  openGraph: {
    title: 'Nishkarsh Mishra – Co-Founder, COO & CMO of DIMISI Technologies',
    description:
      'Profile of Nishkarsh Mishra, Co-Founder, Director, COO & CMO of DIMISI Technologies Pvt Ltd.',
    type: 'profile',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://cati47.tech/#nishkarsh-mishra',
      name: 'Nishkarsh Mishra',
      jobTitle: 'Co-Founder, Chief Operating Officer (COO) & Chief Marketing Officer (CMO)',
      worksFor: { '@id': 'https://cati47.tech/#dimisi-technologies' },
      url: 'https://cati47.tech/team/nishkarsh-mishra',
      image: 'https://cati47.tech/team/nishkarsh-mishra.png',
      description:
        'Co-Founder, Director, COO and CMO of DIMISI Technologies Pvt Ltd, driving operational excellence, marketing campaigns, and brand partnerships.',
      knowsAbout: [
        'Operations Strategy',
        'Growth Marketing',
        'User Acquisition',
        'Brand Building',
        'Strategic Partnerships',
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://cati47.tech/#dimisi-technologies',
      name: 'DIMISI Technologies Pvt Ltd',
      alternateName: ['DIMISI Technologies', 'DIMISI'],
      url: 'https://cati47.tech/',
      founder: { '@id': 'https://cati47.tech/#nishkarsh-mishra' },
      description: 'Software product and technology enterprise based in Kanpur, Uttar Pradesh.',
    },
  ],
};

const pillars = [
  {
    icon: '📊',
    title: 'Operational Excellence',
    desc: 'Develops streamlined operating frameworks that maximize team velocity, resource allocation, and project delivery.',
  },
  {
    icon: '🎯',
    title: 'Growth & Brand Marketing',
    desc: 'Crafts targeted user acquisition, digital presence, and viral growth campaigns for consumer applications.',
  },
  {
    icon: '🤝',
    title: 'Strategic Partnerships',
    desc: 'Fosters institutional alliances, academic collaborations, and industry networking to elevate market presence.',
  },
  {
    icon: '👥',
    title: 'Community & User Engagement',
    desc: 'Builds vibrant user communities, gathering direct customer feedback to refine product strategy.',
  },
];

const techTable = [
  { label: 'Principal Entity', value: 'Nishkarsh Mishra' },
  { label: 'Corporate Roles', value: 'Co-Founder, Director, Chief Operating Officer (COO), Chief Marketing Officer (CMO)' },
  { label: 'Parent Organization', value: 'DIMISI Technologies Pvt Ltd' },
  { label: 'CIN Registration', value: 'U62013UP2026PTC246506 (Ministry of Corporate Affairs, India)' },
  { label: 'Key Projects', value: 'Kalesh Growth & Operations, DIMISIPEDIA Documentation, Corporate Marketing' },
  { label: 'Acronym Origin', value: 'Represents the "MI" (Mishra) in DIMISI (DI-MI-SI)' },
  { label: 'Strategic Focus', value: 'Operations Management, Digital Marketing, Product Growth, Strategic Outreach' },
];

const faqs = [
  {
    q: 'Who is Nishkarsh Mishra?',
    a: 'Nishkarsh Mishra is an Indian technology entrepreneur, operations strategist, and marketing executive based in Kanpur, Uttar Pradesh. He is a Co-Founder and Director of DIMISI Technologies Private Limited, serving as both COO and CMO.',
  },
  {
    q: 'What are Nishkarsh Mishra\'s responsibilities at DIMISI Technologies?',
    a: 'Mishra leads cross-functional operations, brand positioning, user acquisition strategies, and marketing communications across all DIMISI products including Kalesh, DIMISIPEDIA, and CATI KHELGHAR.',
  },
  {
    q: 'What notable events and programs has Nishkarsh Mishra participated in?',
    a: 'Mishra represented DIMISI initiatives at major entrepreneurship platforms, notably including the prestigious IIT Bombay E-Summit 2025, and joined the founding team during early AICTE collaborative programs.',
  },
  {
    q: 'How did the name "DIMISI" originate?',
    a: 'According to Dimisipedia records, "DIMISI" is an acronym combining the founders\' surnames: DI (Dixit), MI (Mishra - representing Nishkarsh Mishra), and SI (Singh).',
  },
];

export default function NishkarshMishraPage() {
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
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start gap-8">
            {/* Photo */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-emerald-500/30 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/team/nishkarsh-mishra.png"
                  alt="Nishkarsh Mishra"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>#2 Co-Founder &amp; COO/CMO</span>
              </span>
            </div>

            {/* Identity */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Operations &amp; Marketing Leadership</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Nishkarsh Mishra</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="w-3 h-3" />
                    <span>Co-Founder, Director, COO &amp; CMO &middot; DIMISI</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Award className="w-3 h-3" />
                    <span>Growth &amp; Brand Strategist</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                <strong className="text-white">Nishkarsh Mishra</strong> is a{' '}
                <strong className="text-white">
                  Co-Founder, Director, Chief Operating Officer (COO), and Chief Marketing Officer (CMO)
                </strong>{' '}
                of <strong className="text-white">DIMISI Technologies Private Limited</strong>. He leads organizational
                operations, go-to-market strategies, user growth, and brand development across DIMISI&apos;s product
                portfolio.
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  'Operations Management',
                  'Growth Marketing',
                  'Brand Strategy',
                  'User Acquisition',
                  'Strategic Partnerships',
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
                  href="https://dimisipedia.me/wiki/Nishkarsh_Mishra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dimisipedia Record</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Scope */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white">Strategic Operations &amp; Growth Leadership</h2>
          </div>
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              As COO and CMO, Nishkarsh Mishra serves as the linchpin between technical architecture and consumer
              adoption at <strong className="text-white">DIMISI Technologies Pvt Ltd</strong> (incorporated on April 9,
              2026; CIN: U62013UP2026PTC246506).
            </p>
            <p>
              Mishra joined the founding team during an AICTE collaborative initiative, completing the core trio
              alongside Shikhar Dixit and Swatantra Singh. He represented the company&apos;s early product concepts at
              national startup competitions, including the prestigious{' '}
              <strong className="text-white">IIT Bombay E-Summit 2025</strong>.
            </p>
            <p>
              He directs marketing outreach, public relations, and operational scalability across platforms:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>
                <strong className="text-white">Kalesh:</strong> Managing viral user acquisition, social engagement loops, and moderation policies.
              </li>
              <li>
                <strong className="text-white">DIMISIPEDIA:</strong> Curating official institutional documentation and founder archives.
              </li>
              <li>
                <strong className="text-white">CATI KHELGHAR:</strong> Directing audience outreach and positioning for offline casual tabletop gaming.
              </li>
            </ul>
          </div>
        </div>

        {/* Pillars */}
        <div className="space-y-5">
          <h2 className="text-xl font-black text-white">Operations &amp; Marketing Pillars</h2>
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
          <h2 className="text-xl font-black text-white">Executive &amp; Corporate Summary</h2>
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
                  <ChevronRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
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

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Crown, Code2, Globe, Building2, ChevronRight, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shikhar Dixit – Founder & CEO of DIMISI Technologies | Developer of CATI KHELGHAR',
  description:
    'Profile of Shikhar Dixit, Founder and CEO of DIMISI Technologies Pvt Ltd and developer of CATI KHELGHAR—the offline-first, instant-load local multiplayer gaming platform.',
  openGraph: {
    title: 'Shikhar Dixit – Founder & CEO of DIMISI Technologies',
    description:
      'Profile of Shikhar Dixit, Founder and CEO of DIMISI Technologies Pvt Ltd and developer of CATI KHELGHAR.',
    type: 'profile',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://cati47.tech/#shikhar-dixit',
      name: 'Shikhar Dixit',
      jobTitle: 'Founder & CEO',
      worksFor: { '@id': 'https://cati47.tech/#dimisi-technologies' },
      url: 'https://cati47.tech/team/shikhar-dixit',
      image: 'https://cati47.tech/team/shikhar-dixit.png',
      description: 'Founder and CEO of DIMISI Technologies Pvt Ltd and developer of CATI KHELGHAR.',
      knowsAbout: [
        'Software Engineering',
        'Web Development',
        'Offline-First Web Architecture',
        'Casual Game Development',
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://cati47.tech/#dimisi-technologies',
      name: 'DIMISI Technologies Pvt Ltd',
      alternateName: ['DIMISI Technologies', 'DIMISI'],
      url: 'https://cati47.tech/',
      founder: { '@id': 'https://cati47.tech/#shikhar-dixit' },
      description: 'Software product and technology company focused on privacy-first, lightweight web applications.',
      knowsAbout: ['Cosmic Aura Tech Industry', 'CATI'],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://cati47.tech/#cati-khelghar',
      name: 'CATI KHELGHAR',
      alternateName: 'CATI KHELGHAR by Dimisi',
      applicationCategory: 'GameApplication',
      operatingSystem: 'All modern web browsers',
      url: 'https://cati47.tech/',
      author: { '@id': 'https://cati47.tech/#shikhar-dixit' },
      publisher: { '@id': 'https://cati47.tech/#dimisi-technologies' },
      description:
        'A 100% offline-ready, account-free local pass-and-play casual gaming platform designed for friends and family with sub-second load times.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        '100% Offline-ready (works without internet)',
        'Pass & Play (2-4 players on the same screen)',
        'Zero accounts required (no logins or signups)',
        'Instant load times (under 1 second)',
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://cati47.tech/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Who is Shikhar Dixit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Shikhar Dixit is an Indian software developer and entrepreneur. He is the Founder and CEO of DIMISI Technologies Pvt Ltd and the creator of CATI KHELGHAR.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is CATI KHELGHAR?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'CATI KHELGHAR is a browser-based casual gaming ecosystem developed under DIMISI Technologies. Designed for friends and families, the platform provides simple, local multiplayer games optimized for local pass-and-play without network latency.',
          },
        },
        {
          '@type': 'Question',
          name: 'What company owns CATI KHELGHAR?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'CATI KHELGHAR is an official gaming ecosystem product developed and owned by DIMISI Technologies Pvt Ltd, tracing its engineering lineage to Cosmic Aura Tech Industry (CATI).',
          },
        },
        {
          '@type': 'Question',
          name: 'Does CATI KHELGHAR require an internet connection or an account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. CATI KHELGHAR is 100% offline-ready, operates without an internet connection once loaded, and requires zero user accounts, registrations, or logins.',
          },
        },
        {
          '@type': 'Question',
          name: 'How fast does CATI KHELGHAR load?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The platform is optimized to achieve cold-boot load times of under 1 second, running entirely on lightweight client-side scripts.',
          },
        },
      ],
    },
  ],
};

const pillars = [
  {
    icon: '📶',
    title: '100% Offline-Ready',
    desc: 'Fully functional as a progressive offline application; games load and execute locally without requiring an active internet connection.',
  },
  {
    icon: '🎮',
    title: 'Pass & Play Local Multiplayer',
    desc: 'Tailored for 2–4 players competing on the same screen, reviving face-to-face tabletop dynamics on mobile and desktop viewports.',
  },
  {
    icon: '🔒',
    title: 'Zero Accounts Required',
    desc: 'Built on complete user privacy and zero data harvesting — no logins, passwords, phone verifications, or email captures.',
  },
  {
    icon: '⚡',
    title: 'Instant Load Times',
    desc: 'Engineered with modern, lightweight web frameworks to ensure cold-boot render and execution in under 1 second.',
  },
];

const techTable = [
  { label: 'Principal Entity', value: 'Shikhar Dixit' },
  { label: 'Corporate Roles', value: 'Founder, Chief Executive Officer (CEO), Lead Developer' },
  { label: 'Parent Organization', value: 'DIMISI Technologies Pvt Ltd' },
  { label: 'Flagship Product', value: 'CATI KHELGHAR by Dimisi' },
  { label: 'Heritage / Origin', value: 'Cosmic Aura Tech Industry (CATI)' },
  { label: 'Official Domain', value: 'cati47.tech', isLink: true },
  { label: 'Engineering Focus', value: 'Lightweight Web Apps, Local-First Architecture, Frictionless UX' },
];

const faqs = [
  {
    q: 'Who is Shikhar Dixit?',
    a: 'Shikhar Dixit is an Indian software developer and entrepreneur. He is the Founder and CEO of DIMISI Technologies Pvt Ltd and the creator of CATI KHELGHAR.',
  },
  {
    q: 'What is CATI KHELGHAR?',
    a: 'CATI KHELGHAR is a browser-based casual gaming ecosystem developed under DIMISI Technologies. Designed for friends and families, the platform provides simple, local multiplayer games optimized for local pass-and-play without network latency.',
  },
  {
    q: 'What company owns CATI KHELGHAR?',
    a: 'CATI KHELGHAR is an official gaming ecosystem product developed and owned by DIMISI Technologies Pvt Ltd, tracing its engineering lineage to Cosmic Aura Tech Industry (CATI).',
  },
  {
    q: 'Does CATI KHELGHAR require an internet connection or an account?',
    a: 'No. CATI KHELGHAR is 100% offline-ready, operates without an internet connection once loaded, and requires zero user accounts, registrations, or logins.',
  },
  {
    q: 'How fast does CATI KHELGHAR load?',
    a: 'The platform is optimized to achieve cold-boot load times of under 1 second, running entirely on lightweight client-side scripts.',
  },
];

export default function ShikharDixitPage() {
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
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start gap-8">
            {/* Photo */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-orange-500/30 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/team/shikhar-dixit.png"
                  alt="Shikhar Dixit"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Crown className="w-2.5 h-2.5" />
                <span>#1 Founder &amp; CEO</span>
              </span>
            </div>

            {/* Identity */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Executive Leadership</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Shikhar Dixit</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Crown className="w-3 h-3" />
                    <span>Founder &amp; CEO &middot; DIMISI Technologies</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Code2 className="w-3 h-3" />
                    <span>Developer &mdash; CATI KHELGHAR</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                <strong className="text-white">Shikhar Dixit</strong> is the{' '}
                <strong className="text-white">Founder and CEO of DIMISI Technologies Pvt Ltd</strong> and the{' '}
                <strong className="text-white">Developer of CATI KHELGHAR</strong>, a lightweight, offline-first
                digital playground engineered for friends and family. Combining technical product architecture with
                human-centric software design, Dixit leads DIMISI&apos;s initiatives to create friction-free digital
                experiences that bridge accessibility, high-performance web engineering, and social play.
              </p>

              <div className="flex flex-wrap gap-2">
                {['Product Design', 'Full-Stack Dev', 'Game Architecture', 'Offline-First Web', 'UI/UX Engineering'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  )
                )}
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
                  href="https://dimisipedia.me/wiki/Shikhar_Dixit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dimisipedia Record</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership & Vision */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-black text-white">Leadership &amp; Vision: DIMISI Technologies</h2>
          </div>
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              Under the leadership of Shikhar Dixit,{' '}
              <strong className="text-white">DIMISI Technologies Pvt Ltd</strong> develops scalable software
              products focused on speed, utility, and user privacy.
            </p>
            <p>
              Dixit originally incubated core product concepts under the moniker{' '}
              <strong className="text-white">Cosmic Aura Tech Industry (CATI)</strong>. As the initiative matured
              into a full-scale corporate umbrella at DIMISI Technologies, the CATI heritage became the foundation
              for the company&apos;s consumer gaming wing, culminating in the launch of{' '}
              <strong className="text-white">CATI KHELGHAR by Dimisi</strong>.
            </p>
            <p>
              Dixit directs product engineering, architecture, and technology strategy across the company&apos;s
              portfolio, prioritizing zero-bloat web standards that execute reliably across varying network
              constraints and hardware tiers.
            </p>
          </div>
        </div>

        {/* Architecture */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-xl select-none">🎮</span>
            <h2 className="text-xl font-black text-white">Architectural Flagship: CATI KHELGHAR</h2>
          </div>
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300 leading-relaxed">
            <p>
              As the primary architect and developer behind{' '}
              <strong className="text-white">CATI KHELGHAR</strong>, Dixit designed the platform to counter the
              high barriers to entry prevalent in modern casual gaming &mdash; such as invasive telemetry, mandatory
              profile registrations, heavy downloads, and persistent network dependencies.
            </p>
            <p className="mt-3">
              Built for shared, in-person social interactions, CATI KHELGHAR delivers simple, accessible games
              anchored by four foundational engineering pillars:
            </p>
          </div>
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
          <h2 className="text-xl font-black text-white">Technical Summary &amp; Domain Authority</h2>
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-xs">
              <tbody>
                {techTable.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-slate-900/80' : 'bg-slate-900/40'}>
                    <td className="px-5 py-3 font-bold text-slate-300 w-2/5 border-r border-slate-800">{row.label}</td>
                    <td className="px-5 py-3 text-slate-200">
                      {row.isLink ? (
                        <a
                          href="https://cati47.tech/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </td>
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
                  <ChevronRight className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
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

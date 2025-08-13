import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Living Collective Community',
  description: 'Learn about the Living Collective Community and our mission.'
}

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Living Collective Community</h1>
        <p className="text-lg text-gray-600">Connecting people, businesses, and neighborhoods through shared values.</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <p>
          The Living Collective Community is a grassroots initiative focused on building meaningful connections
          between residents, local businesses, and community leaders. We believe thriving neighborhoods are built
          on collaboration, inclusivity, and access to trusted local services.
        </p>
        <p>
          Our platform empowers people to discover and support nearby businesses, participate in community events,
          and share resources that enrich daily life. Together, we cultivate a vibrant, supportive ecosystem where
          everyone can contribute and benefit.
        </p>
        <h2>Our Principles</h2>
        <ul>
          <li><strong>Inclusivity</strong> — Everyone is welcome, and every voice matters.</li>
          <li><strong>Trust</strong> — Verified information and transparent communication.</li>
          <li><strong>Sustainability</strong> — Long-term growth for people and local economy.</li>
          <li><strong>Collaboration</strong> — We build better, together.</li>
        </ul>
        <h2>What We Do</h2>
        <ul>
          <li>Curate a directory of trusted, community-first businesses</li>
          <li>Highlight local initiatives and events</li>
          <li>Facilitate connections between residents and service providers</li>
        </ul>
      </div>
    </main>
  )
}

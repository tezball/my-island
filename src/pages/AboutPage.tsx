import { Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Icon from '../components/ui/Icon'

export default function AboutPage() {
  const teamMembers = [
    { name: 'Sarah Murphy', role: 'CEO & Founder', icon: 'person' },
    { name: "Michael O'Brien", role: 'CTO', icon: 'code' },
    { name: 'Emma Walsh', role: 'Head of Operations', icon: 'settings' },
    { name: 'Conor Kelly', role: 'Customer Success Lead', icon: 'support_agent' },
  ]

  const stats = [
    { value: '120+', label: 'Campsites' },
    { value: '50,000+', label: 'Happy Campers' },
    { value: '32', label: 'Counties' },
    { value: '4.8', label: 'Average Rating' },
  ]

  return (
    <AppShell showBack headerTitle="About Us">
      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="relative h-48 bg-gradient-to-br from-primary to-emerald-600">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl font-bold mb-2">my-island</h1>
              <p className="text-white/90">Discover Ireland's Best Camping</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-8">
          {/* Mission */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Our Mission
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              At my-island, we believe that camping should be accessible, enjoyable, and
              sustainable. Our platform connects outdoor enthusiasts with unique camping
              experiences across Ireland, from wild coastal sites along the Wild Atlantic
              Way to serene lakeside retreats in the midlands.
            </p>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center"
              >
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* Our Story */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Our Story
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Founded in 2023, my-island started with a simple idea: make it easier for
              people to discover and book camping experiences across Ireland. What began
              as a weekend project by a group of camping enthusiasts has grown into
              Ireland's leading platform for outdoor accommodations.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Today, we partner with over 120 campsites, glamping sites, and holiday
              parks across all 32 counties, helping thousands of families and adventurers
              create unforgettable memories in the great outdoors.
            </p>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Our Values
            </h2>
            <div className="space-y-3">
              {[
                { icon: 'eco', title: 'Sustainability', desc: 'Promoting eco-friendly camping practices' },
                { icon: 'groups', title: 'Community', desc: 'Building connections between campers and hosts' },
                { icon: 'verified', title: 'Trust', desc: 'Verified reviews and secure bookings' },
                { icon: 'explore', title: 'Adventure', desc: 'Inspiring outdoor exploration' },
              ].map((value, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={value.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-500">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Our Team
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-surface-dark rounded-xl p-4 text-center border border-slate-100 dark:border-slate-800"
                >
                  <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Icon name={member.icon} size={28} className="text-primary" />
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    {member.name}
                  </p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-primary/5 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              Have Questions?
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              We'd love to hear from you. Get in touch with our team.
            </p>
            <Link
              to="/support/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
            >
              <Icon name="mail" size={18} />
              Contact Us
            </Link>
          </section>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

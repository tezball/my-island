import AppShell from '../components/layout/AppShell'

export default function PrivacyPage() {
  return (
    <AppShell showBack headerTitle="Privacy Policy">
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          <div className="text-sm text-slate-500">
            Last updated: January 2, 2026
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Introduction
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Welcome to my-island ("we," "our," or "us"). We are committed to protecting
              your privacy and personal data. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our mobile
              application and website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Information We Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Payment information (processed securely through our payment providers)</li>
              <li>Booking history and preferences</li>
              <li>Communications with us or campsite hosts</li>
              <li>Reviews and ratings you submit</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. How We Use Your Information
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Process and manage your bookings</li>
              <li>Communicate with you about your reservations</li>
              <li>Send you promotional communications (with your consent)</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Sharing Your Information
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Campsite hosts to fulfill your bookings</li>
              <li>Payment processors to handle transactions</li>
              <li>Service providers who assist our operations</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              5. Data Security
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We implement appropriate technical and organizational measures to protect
              your personal data against unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the internet is 100%
              secure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              6. Your Rights (GDPR)
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Under the General Data Protection Regulation (GDPR), you have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request erasure of your data</li>
              <li>Restrict processing of your data</li>
              <li>Data portability</li>
              <li>Object to processing</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              7. Cookies
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience.
              You can control cookies through your browser settings. Essential cookies are
              required for the platform to function properly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              8. Children's Privacy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Our services are not intended for children under 16. We do not knowingly
              collect personal information from children under 16. If we discover such
              data has been collected, we will delete it promptly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              9. Changes to This Policy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of
              any changes by posting the new policy on this page and updating the "Last
              updated" date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              10. Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If you have questions about this Privacy Policy or wish to exercise your
              rights, please contact us at:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-1">
              <p className="text-slate-900 dark:text-white font-medium">my-island</p>
              <p className="text-slate-600 dark:text-slate-400">Email: privacy@my-island.com</p>
              <p className="text-slate-600 dark:text-slate-400">Address: Dublin, Ireland</p>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}
